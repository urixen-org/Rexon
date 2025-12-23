use anyhow::Result;

use playit_control::PlayitCtl;
use std::env;
use std::io::{self, Write};
use std::net::IpAddr;
use std::str::FromStr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use tokio::task;
use tokio::time::sleep;
use tracing_subscriber::EnvFilter;
use uuid::Uuid;

#[tokio::main]
async fn main() -> Result<()> {
    // init logging from RUST_LOG if present
    tracing_subscriber::fmt::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Read secret from env or first CLI arg
    /*let secret = env::var("PLAYIT_SECRET")
        .ok()
        .or_else(|| env::args().nth(1));
    let secret = match secret {
        Some(s) => s,
        None => {
            eprintln!("PLAYIT_SECRET not set and no secret passed as first argument.");
            eprintln!("Obtain a writable secret (claim flow) and either export PLAYIT_SECRET or pass it as the first argument.");
            std::process::exit(1);
        }
    };*/
    let secret = "8d27332677a7edda78f2c80e3547dc3b1f2100fd51f4b3f0a8a232b1b9f2fd53";

    // optional overrides via env:
    // LOCAL_IP (default 127.0.0.1), LOCAL_PORT (default 25565)
    let local_ip = env::var("LOCAL_IP")
        .ok()
        .and_then(|s| IpAddr::from_str(&s).ok())
        .unwrap_or_else(|| IpAddr::from_str("127.0.0.1").unwrap());

    let local_port: u16 = env::var("LOCAL_PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(25565u16);

    let api_base = "https://api.playit.gg";
    let ctl = PlayitCtl::new(api_base, secret.clone());

    println!("Discovering agent id for this account/secret...");
    let agent_id: Uuid = match ctl.discover_agent_id().await? {
        Some(a) => a,
        None => {
            eprintln!("No agent id discovered. Make sure an agent using the same secret is running and connected.");

            std::process::exit(1);
        }
    };
    println!("Using agent id: {}", agent_id);

    println!(
        "Attempting to create a Minecraft Java tunnel (local {}:{})...",
        local_ip, local_port
    );

    // Try direct Java create; fall back to auto-all if direct fails
    let tid = match ctl
        .create_minecraft_java(
            Some("java-demo".to_string()),
            agent_id,
            local_ip,
            local_port,
        )
        .await
    {
        Ok(id) => id,
        Err(e) => {
            eprintln!("Direct minecraft-java create failed: {:#}", e);
            eprintln!("Falling back to broader auto-create logic (paid -> free fallbacks)...");
            match ctl
                .create_tunnel_auto_all(Some("java-demo".to_string()), local_ip, local_port)
                .await
            {
                Ok(id2) => id2,
                Err(e2) => {
                    eprintln!("Auto-create also failed: {:#}", e2);

                    std::process::exit(1);
                }
            }
        }
    };

    println!("Created tunnel id: {}", tid);

    println!("Waiting up to 60s for the tunnel to be assigned a public address...");
    match ctl
        .wait_for_assignment(tid, Duration::from_secs(60))
        .await?
    {
        Some(addr) => {
            println!("Tunnel assigned at: {}", addr);
            println!("You can connect with Minecraft Java to this host:port.");
        }
        None => {
            println!("Tunnel didn't get assigned within 60s. Ensure the agent is running and able to allocate.");
        }
    }

    println!("Tunnel will be kept until you press Enter. Press Enter to delete it and exit.");
    let _ = io::stdin().read_line(&mut String::new());

    println!("Deleting tunnel {} ...", tid);
    if let Err(e) = ctl.delete_tunnel(tid).await {
        eprintln!("Failed to delete tunnel: {:#}", e);
    } else {
        println!("Deleted.");
    }

    // give server a moment
    sleep(Duration::from_secs(1)).await;

    // give the agent a moment to shutdown
    sleep(Duration::from_secs(1)).await;

    Ok(())
}
