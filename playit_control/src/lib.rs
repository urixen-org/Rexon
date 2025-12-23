use anyhow::{Context, Result};
use playit_api_client::api::{
    AssignedAgentCreate, AssignedDefaultCreate, ObjectId, PortType, ReqTunnelsCreate,
    ReqTunnelsDelete, ReqTunnelsList, TunnelOriginCreate, TunnelType,
};
use playit_api_client::PlayitApi;
use serde_json::Value;
use std::net::IpAddr;
use std::time::Duration;
use tokio::time::sleep;
use uuid::Uuid;
//pub mod autorun;
/// Lightweight controller around the repo's PlayitApi for common operations.
pub struct PlayitCtl {
    api: PlayitApi,
}

impl PlayitCtl {
    /// Create a controller from API base and agent/account secret.
    pub fn new(api_base: impl Into<String>, secret: impl Into<String>) -> Self {
        let api_base = api_base.into();
        let secret = secret.into();
        let api = PlayitApi::create(api_base, Some(secret));
        PlayitCtl { api }
    }

    /// Discover an agent UUID for this account/secret by scanning API responses for UUID-like strings.
    pub async fn discover_agent_id(&self) -> Result<Option<Uuid>> {
        // Try agents_rundata
        if let Ok(data) = self.api.agents_rundata().await {
            if let Ok(json) = serde_json::to_value(&data) {
                if let Some(uuid) = Self::find_first_uuid_in_value(&json) {
                    return Ok(Some(uuid));
                }
            }
        }

        // Try tunnels list
        if let Ok(resp) = self
            .api
            .tunnels_list_json(ReqTunnelsList {
                tunnel_id: None,
                agent_id: None,
            })
            .await
        {
            if let Ok(json) = serde_json::to_value(&resp) {
                if let Some(uuid) = Self::find_first_uuid_in_value(&json) {
                    return Ok(Some(uuid));
                }
            }
        }

        // Try agents routing
        if let Ok(route) = self
            .api
            .agents_routing_get(playit_api_client::api::ReqAgentsRoutingGet { agent_id: None })
            .await
        {
            if let Ok(json) = serde_json::to_value(&route) {
                if let Some(uuid) = Self::find_first_uuid_in_value(&json) {
                    return Ok(Some(uuid));
                }
            }
        }

        Ok(None)
    }

    /// Create tunnel using Default origin (control-plane chosen). Returns the created tunnel UUID.
    pub async fn create_tunnel_default(
        &self,
        name: Option<String>,
        local_ip: IpAddr,
        local_port: u16,
        tunnel_type: Option<TunnelType>,
        port_type: PortType,
    ) -> Result<Uuid> {
        let origin = TunnelOriginCreate::Default(AssignedDefaultCreate {
            local_ip,
            local_port: Some(local_port),
        });

        let req = ReqTunnelsCreate {
            name,
            tunnel_type,
            port_type,
            port_count: 1u16,
            origin,
            enabled: true,
            alloc: None,
            firewall_id: None,
            proxy_protocol: None,
        };

        // tunnels_create returns ObjectId
        let created: ObjectId = self
            .api
            .tunnels_create(req)
            .await
            .context("tunnels_create failed (default)")?;
        Ok(created.id)
    }

    /// Create a tunnel that explicitly targets an agent (Agent origin).
    pub async fn create_tunnel_agent(
        &self,
        name: Option<String>,
        agent_id: Uuid,
        local_ip: IpAddr,
        local_port: u16,
        tunnel_type: Option<TunnelType>,
        port_type: PortType,
    ) -> Result<Uuid> {
        let origin = TunnelOriginCreate::Agent(AssignedAgentCreate {
            agent_id,
            local_ip,
            local_port: Some(local_port),
        });

        let req = ReqTunnelsCreate {
            name,
            tunnel_type,
            port_type,
            port_count: 1u16,
            origin,
            enabled: true,
            alloc: None,
            firewall_id: None,
            proxy_protocol: None,
        };

        let created: ObjectId = self
            .api
            .tunnels_create(req)
            .await
            .context("tunnels_create failed (agent)")?;
        Ok(created.id)
    }

    /// Delete a tunnel by its UUID.
    pub async fn delete_tunnel(&self, tunnel_id: Uuid) -> Result<()> {
        let req = ReqTunnelsDelete { tunnel_id };
        let _res: () = self
            .api
            .tunnels_delete(req)
            .await
            .context("tunnels_delete failed")?;
        Ok(())
    }

    /// Wait until a tunnel gets an assigned public address (polls tunnels_list_json).
    pub async fn wait_for_assignment(
        &self,
        tunnel_id: Uuid,
        timeout: Duration,
    ) -> Result<Option<String>> {
        let start = tokio::time::Instant::now();
        loop {
            if start.elapsed() > timeout {
                return Ok(None);
            }

            let list_res = self
                .api
                .tunnels_list_json(ReqTunnelsList {
                    tunnel_id: Some(tunnel_id),
                    agent_id: None,
                })
                .await;

            match list_res {
                Ok(resp) => {
                    let v = serde_json::to_value(&resp)?;
                    if let Some(addr) = Self::find_assigned_address_in_list(&v, tunnel_id) {
                        return Ok(Some(addr));
                    }
                }
                Err(e) => {
                    tracing::warn!(?e, "tunnels_list_json returned error, retrying");
                }
            }

            sleep(Duration::from_secs(2)).await;
        }
    }

    /// Convenience: Create Minecraft Java tunnel for an agent (explicit agent origin).
    pub async fn create_minecraft_java(
        &self,
        name: Option<String>,
        agent_id: Uuid,
        local_ip: IpAddr,
        local_port: u16,
    ) -> Result<Uuid> {
        let tt = Some(TunnelType::MinecraftJava);
        self.create_tunnel_agent(name, agent_id, local_ip, local_port, tt, PortType::Tcp)
            .await
    }

    /// Convenience: Terraria
    pub async fn create_terraria(
        &self,
        name: Option<String>,
        agent_id: Uuid,
        local_ip: IpAddr,
        local_port: u16,
    ) -> Result<Uuid> {
        let tt = Some(TunnelType::Terraria);
        self.create_tunnel_agent(name, agent_id, local_ip, local_port, tt, PortType::Tcp)
            .await
    }

    /// Convenience: Minecraft Bedrock (UDP)
    pub async fn create_minecraft_bedrock(
        &self,
        name: Option<String>,
        agent_id: Uuid,
        local_ip: IpAddr,
        local_port: u16,
    ) -> Result<Uuid> {
        let tt = Some(TunnelType::MinecraftBedrock);
        self.create_tunnel_agent(name, agent_id, local_ip, local_port, tt, PortType::Udp)
            .await
    }

    /// Try paid-style create: default origin first, fallback to agent origin.
    pub async fn create_tunnel_paid_fallback(
        &self,
        name: Option<String>,
        local_ip: IpAddr,
        local_port: u16,
        tunnel_type: Option<TunnelType>,
        port_type: PortType,
    ) -> Result<Uuid> {
        match self
            .create_tunnel_default(name.clone(), local_ip, local_port, tunnel_type, port_type)
            .await
        {
            Ok(id) => return Ok(id),
            Err(e) => {
                let s = format!("{:?}", e);
                if !(s.contains("DefaultAgentNotSupported")
                    || s.contains("RequiresPlayitPremium")
                    || s.contains("NotAllowedWithReadOnly"))
                {
                    return Err(e);
                }
                tracing::warn!(
                    ?e,
                    "default origin create failed; trying agent-origin fallback"
                );
            }
        }

        let agent = self.discover_agent_id().await?;
        let agent = agent.ok_or_else(|| anyhow::anyhow!("no agent discovered for fallback"))?;
        self.create_tunnel_agent(name, agent, local_ip, local_port, tunnel_type, port_type)
            .await
    }

    /// Try free-compatible fallbacks in order (minecraft-java, terraria, bedrock, generic UDP).
    pub async fn create_tunnel_free_fallbacks(
        &self,
        name: Option<String>,
        local_ip: IpAddr,
        local_port: u16,
    ) -> Result<Uuid> {
        let agent = self
            .discover_agent_id()
            .await?
            .ok_or_else(|| anyhow::anyhow!("no agent discovered; start agent with same secret"))?;

        if let Ok(id) = self
            .create_minecraft_java(name.clone(), agent, local_ip, local_port)
            .await
        {
            return Ok(id);
        }

        if let Ok(id) = self
            .create_terraria(name.clone(), agent, local_ip, local_port)
            .await
        {
            return Ok(id);
        }

        if let Ok(id) = self
            .create_minecraft_bedrock(name.clone(), agent, local_ip, local_port)
            .await
        {
            return Ok(id);
        }

        // Generic UDP fallback
        self.create_tunnel_agent(name, agent, local_ip, local_port, None, PortType::Udp)
            .await
    }

    /// Top-level auto helper: try paid-first then free-compatible fallbacks.
    pub async fn create_tunnel_auto_all(
        &self,
        name: Option<String>,
        local_ip: IpAddr,
        local_port: u16,
    ) -> Result<Uuid> {
        let paid_try = self
            .create_tunnel_paid_fallback(name.clone(), local_ip, local_port, None, PortType::Tcp)
            .await;
        if let Ok(id) = paid_try {
            return Ok(id);
        }
        tracing::warn!("paid-style create failed; falling back to free flows");
        self.create_tunnel_free_fallbacks(name, local_ip, local_port)
            .await
    }

    // --- helper JSON extraction utilities ---

    fn find_assigned_address_in_list(list_json: &Value, tunnel_id: Uuid) -> Option<String> {
        let id_str = tunnel_id.to_string();

        fn search<'a>(value: &'a Value, id_str: &str) -> Option<&'a Value> {
            match value {
                Value::Array(arr) => {
                    for e in arr {
                        if let Some(found) = search(e, id_str) {
                            return Some(found);
                        }
                    }
                    None
                }
                Value::Object(map) => {
                    if let Some(Value::String(s)) = map.get("id") {
                        if s == id_str {
                            return Some(value);
                        }
                    }
                    for (_k, v) in map {
                        if let Some(found) = search(v, id_str) {
                            return Some(found);
                        }
                    }
                    None
                }
                _ => None,
            }
        }

        let obj = search(list_json, &id_str)?;
        if let Value::Object(map) = obj {
            if let Some(Value::String(domain)) = map.get("assigned_domain") {
                if let Some(Value::Object(port_obj)) = map.get("port") {
                    if let Some(Value::Number(from_num)) = port_obj.get("from") {
                        if let Some(from_u64) = from_num.as_u64() {
                            return Some(format!("{}:{}", domain, from_u64));
                        }
                    }
                }
                return Some(domain.clone());
            }
        }
        None
    }

    fn find_string_field<'a>(v: &'a Value, key: &str) -> Option<String> {
        match v {
            Value::Object(map) => {
                if let Some(Value::String(s)) = map.get(key) {
                    return Some(s.clone());
                }
                for (_k, vv) in map {
                    if let Some(found) = Self::find_string_field(vv, key) {
                        return Some(found);
                    }
                }
                None
            }
            Value::Array(arr) => {
                for e in arr {
                    if let Some(found) = Self::find_string_field(e, key) {
                        return Some(found);
                    }
                }
                None
            }
            _ => None,
        }
    }

    fn find_first_uuid_in_value(v: &Value) -> Option<Uuid> {
        fn walk(value: &Value, out: &mut Vec<String>) {
            match value {
                Value::Object(map) => {
                    for (_k, v) in map {
                        walk(v, out);
                    }
                }
                Value::Array(arr) => {
                    for e in arr {
                        walk(e, out);
                    }
                }
                Value::String(s) => out.push(s.clone()),
                _ => {}
            }
        }

        let mut strs = Vec::new();
        walk(v, &mut strs);
        for s in strs {
            if let Ok(u) = Uuid::parse_str(&s) {
                return Some(u);
            }
        }
        None
    }
}
