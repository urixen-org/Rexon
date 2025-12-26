import React, { useState, useEffect } from "react";
import {
  listTunnels,
  createTunnel,
  deleteTunnel,
  updateTunnel,
  agentRunData,
} from "@/actions/playit";
import { usePasscode } from "@/lib/Passcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface TunnelRow {
  id: string;
  name: string;
  port_type: string;
  port_count: number;
  active: boolean;
  region: string;
}

export default function PlayitDashboard() {
  const { passcode } = usePasscode();
  const [tunnels, setTunnels] = useState<TunnelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentData, setAgentData] = useState<any>(null);

  const [newTunnelName, setNewTunnelName] = useState("");
  const [tunnelType, setTunnelType] = useState("minecraft-java");
  const [newTunnelPort, setNewTunnelPort] = useState<number>(3000);

  // Fetch tunnels
  const fetchTunnels = async () => {
    if (!passcode) return;
    setLoading(true);
    try {
      const res = await listTunnels(passcode, null);
      setTunnels(
        res.data.tunnels.map((t: any) => ({
          id: t.id,
          name: t.name,
          port_type: t.port_type,
          port_count: t.port_count,
          active: t.active,
          region: t.region,
        })),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tunnels");
    }
    setLoading(false);
  };

  // Fetch agent run data
  const fetchAgentData = async () => {
    if (!passcode) return;
    try {
      const data = await agentRunData(passcode);
      setAgentData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTunnels();
    fetchAgentData();
  }, [passcode]);

  // Delete tunnel
  const handleDelete = async (id: string) => {
    await deleteTunnel(passcode, id);
    setTunnels((prev) => prev.filter((t) => t.id !== id));
  };

  // Enable/disable tunnel
  const handleToggle = async (tunnel: TunnelRow) => {
    await updateTunnel({
      tunnel_id: tunnel.id,
      enabled: !tunnel.active,
      port: tunnel.port_count,
      passcode,
    });
    setTunnels((prev) =>
      prev.map((t) => (t.id === tunnel.id ? { ...t, active: !t.active } : t)),
    );
  };

  // Create tunnel
  const handleCreateTunnel = async () => {
    if (!passcode || !newTunnelName) return;
    try {
      await createTunnel({
        name: newTunnelName,
        tunnel_type: tunnelType,
        port_type: tunnelType == "minecraft-java" ? "tcp" : "udp",
        port_count: 1,
        port: newTunnelPort,
        passcode,
      });
      setNewTunnelName("");
      setNewTunnelPort(3000);
      setTunnelType("");
      fetchTunnels();
    } catch (err) {
      console.error(err);
      alert("Failed to create tunnel");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Agent Info */}
      {agentData && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Agent ID: {agentData.data.agent_id}</p>
            <p>Type: {agentData.data.agent_type}</p>
            <p>Account Status: {agentData.data.account_status}</p>
            <p>
              Regional Tunnels:{" "}
              {agentData.data.account_features?.regional_tunnels ? "✅" : "❌"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Fetch tunnels */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Tunnels</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={fetchTunnels} disabled={loading}>
            {loading ? "Loading..." : "Refresh Tunnels"}
          </Button>

          {/* Create Tunnel Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Tunnel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tunnel</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Input
                  placeholder="Tunnel Name"
                  value={newTunnelName}
                  onChange={(e) => setNewTunnelName(e.target.value)}
                />
                <NativeSelect onChange={(e) => setTunnelType(e.target.value)}>
                  <NativeSelectOption value={"minecraft-java"}>
                    Minecraft java
                  </NativeSelectOption>
                  <NativeSelectOption value={"minecraft-bedrock"}>
                    Minecraft Bedrock
                  </NativeSelectOption>
                </NativeSelect>
                <Input
                  type="text"
                  placeholder="Port"
                  inputMode="numeric"
                  value={newTunnelPort === 0 ? "" : String(newTunnelPort)}
                  onChange={(e) => {
                    const v = e.target.value;

                    if (v === "") {
                      setNewTunnelPort(0);
                      return;
                    }

                    if (!/^\d+$/.test(v)) return;

                    const port = Number(v);

                    if (port > 65535) return;

                    setNewTunnelPort(port);
                  }}
                />

                <Button onClick={handleCreateTunnel}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tunnel Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tunnels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Port Type</TableHead>
                <TableHead>Port Count</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tunnels.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.port_type}</TableCell>
                  <TableCell>{t.port_count}</TableCell>
                  <TableCell>{t.region}</TableCell>
                  <TableCell>{t.active ? "✅" : "❌"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(t)}
                    >
                      {t.active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
