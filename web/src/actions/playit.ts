import axios from "axios";
import {
  type AgentRunData,
  type CreateTunnelReq,
  type Tunnel,
  type TunnelCreationResponse,
} from "types";

const client = axios.create({
  baseURL: "/api/playit",
});

export async function listTunnels(passcode: string, tunnelId: any) {
  if (tunnelId) {
    return (
      await client.get(
        "/tunnel/list?passcode=" + passcode + "&tunnel=" + tunnelId,
      )
    ).data as Tunnel;
  } else {
    return (await client.get("/tunnel/list?passcode=" + passcode))
      .data as Tunnel;
  }
}

export async function queryRegion(passcode: string) {
  return (await client.get("/region/query?passcode=" + passcode)).data;
}

export async function agentRunData(passcode: string) {
  return (await client.get("/agent/rundata?passcode=" + passcode))
    .data as AgentRunData;
}

export async function createTunnel(data: CreateTunnelReq) {
  return (await client.post("/tunnel/create", data))
    .data as TunnelCreationResponse;
}

export async function deleteTunnel(passcode: string, tunnelId: string) {
  return (
    await client.delete("/tunnel/delete", {
      data: {
        tunnel_id: tunnelId,
        passcode,
      },
    })
  ).data;
}

export async function updateTunnel(data: {
  tunnel_id: string;
  enabled: boolean;
  port: number;
  passcode: string;
}) {
  return (await client.patch("/tunnel/update", data)).data;
}
