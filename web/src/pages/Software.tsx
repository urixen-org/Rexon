import { useEffect, useMemo, useState } from "react";
import {
  getVersions,
  getBuild,
  type VersionEntry,
  type Registry,
  type BuildsResponse,
} from "@/lib/registryResolver";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function RegistryDownloader() {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [registryError, setRegistryError] = useState<string | null>(null);

  const [softwareId, setSoftwareId] = useState("");
  const [versions, setVersions] = useState<VersionEntry | null>(null);
  const [version, setVersion] = useState("");

  const [builds, setBuilds] = useState<BuildsResponse | null>(null);
  const [buildIndex, setBuildIndex] = useState("");

  const [ackExperimental, setAckExperimental] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- load registry ---------------- */

  useEffect(() => {
    let cancelled = false;

    fetch("https://opendata.xenovate.dpdns.org/json/mc/registry.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load registry");
        return res.json();
      })
      .then((data: Registry) => {
        if (!cancelled) setRegistry(data);
      })
      .catch((e) => {
        if (!cancelled) setRegistryError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- software → versions ---------------- */

  useEffect(() => {
    if (!registry || !softwareId) return;

    setVersions(null);
    setVersion("");
    setBuilds(null);
    setBuildIndex("");
    setDownloadUrl(null);
    setAckExperimental(false);
    setError(null);

    getVersions(registry, softwareId)
      .then(setVersions)
      .catch((e) => setError(e.message));
  }, [registry, softwareId]);

  /* ---------------- version → builds ---------------- */

  useEffect(() => {
    if (!registry || !softwareId || !version) return;

    setBuilds(null);
    setBuildIndex("");
    setDownloadUrl(null);
    setAckExperimental(false);
    setError(null);

    getBuild(registry, softwareId, version)
      .then(setBuilds)
      .catch((e) => setError(e.message));
  }, [registry, softwareId, version]);

  /* ---------------- derived build ---------------- */

  const selectedBuild = useMemo(() => {
    if (!builds || buildIndex === "") return null;
    return builds.builds[Number(buildIndex)] ?? null;
  }, [builds, buildIndex]);

  /* ---------------- download resolution ---------------- */

  useEffect(() => {
    if (!selectedBuild) return;
    if (selectedBuild.experimental && !ackExperimental) return;

    setDownloadUrl(
      selectedBuild.installation?.[0]?.[0]?.url ?? null
    );
  }, [selectedBuild, ackExperimental]);

  /* ---------------- loading & error states ---------------- */

  if (registryError) {
    return (
      <div className="p-6 text-destructive">
        Failed to load registry: {registryError}
      </div>
    );
  }

  if (!registry) {
    return (
      <div className="w-screen min-h-screen grid place-items-center">
        <span className="text-sm text-muted-foreground">
          Loading registry…
        </span>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="w-screen min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl p-6">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-lg font-semibold">
            Minecraft Server Download
          </h3>

          {/* Software */}
          <Select value={softwareId} onValueChange={setSoftwareId}>
            <SelectTrigger>
              <SelectValue placeholder="Select software" />
            </SelectTrigger>
            <SelectContent>
              {registry.softwares.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Version */}
          {versions && (
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(versions.builds ?? {}).map(
                  ([ver, info]) => (
                    <SelectItem key={ver} value={ver}>
                      {ver} —{" "}
                      {info.created
                        ? new Date(info.created).toLocaleDateString()
                        : "Unknown"}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}

          {/* Build */}
          {builds && (
            <Select
              value={buildIndex}
              onValueChange={(v) => {
                setBuildIndex(v);
                setAckExperimental(false);
                setDownloadUrl(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select build" />
              </SelectTrigger>
              <SelectContent>
                {builds.builds.map((b, i) => (
                  <SelectItem key={b.id} value={String(i)}>
                    {b.name} —{" "}
                    {b.created
                      ? new Date(b.created).toLocaleDateString()
                      : "Unknown"}
                    {b.experimental && " (experimental)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Experimental */}
          {selectedBuild?.experimental && (
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Checkbox
                checked={ackExperimental}
                onCheckedChange={(v) =>
                  setAckExperimental(!!v)
                }
              />
              <span className="text-sm">
                I understand this build is experimental
              </span>
            </div>
          )}

          {/* Download */}
          <Button
            className="w-full"
            disabled={!downloadUrl}
            onClick={() => {
              if (downloadUrl)
                window.location.href = downloadUrl;
            }}
          >
            Download Server
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
