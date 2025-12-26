export type Registry = {
  schema: number;
  name: string;
  description: string;
  author: string;
  softwares: Software[];
};

export type Software = {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: string;
  api: {
    versions: {
      url: string;
      fields: string[];
    };
    build: {
      url: string;
      fields: string[];
    };
  };
  mapping: {
    software: string;
    version: string;
    build: string;
  };
};

export interface VersionEntry {
  success: boolean
  builds: Builds
}

export interface Builds {
  [key: string]: {
    type: string
    supported: boolean
    java: number
    builds: number
    created: string
    latest: Latest
  }
}


export interface Latest {
  versionId: string
  projectVersionId: string | null
}

export interface BuildFile {
  type: "download";
  url: string;
  file: string;
  size: number;
}

export type InstallationStep = BuildFile[];

export interface Build {
  id: number;
  versionId: string;
  projectVersionId: string | null;
  type: string;
  experimental: boolean;
  name: string;
  installation: InstallationStep[];
  changes: string[];
  created: string; // ISO date string
}

export interface BuildsResponse {
  success: boolean;
  builds: Build[];
}


export type BuildEntry = {
  id: string;
  type: string;
  projectVersionId: string;
  versionId: string;
  name: string;
  experimental: boolean;
  created: string;
  changes?: unknown;
  installation?: {
    url?: string;
    [key: string]: unknown;
  };
};

function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  let out = template;
  for (const key in values) {
    out = out.replaceAll(`{{${key}}}`, values[key]);
  }
  return out;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getSoftware(registry: Registry, softwareId: string): Software {
  const software = registry.softwares.find((s) => s.id === softwareId);
  if (!software) {
    throw new Error(`Software "${softwareId}" not found in registry`);
  }
  return software;
}

export async function getVersions(
  registry: Registry,
  softwareId: string,
): Promise<VersionEntry> {
  const software = getSoftware(registry, softwareId);

  const baseUrl = fillTemplate(software.api.versions.url, {
    software: software.type,
  });

  const url = new URL(baseUrl);
  url.searchParams.set("fields", software.api.versions.fields.join(","));

  return fetchJson<VersionEntry>(url.toString());
}

export async function getBuild(
  registry: Registry,
  softwareId: string,
  version: string,
): Promise<BuildsResponse> {
  const software = getSoftware(registry, softwareId);

  const baseUrl = fillTemplate(software.api.build.url, {
    software: software.type,
    version,
  });

  const url = new URL(baseUrl);
  url.searchParams.set("fields", software.api.build.fields.join(","));

  return fetchJson<BuildsResponse>(url.toString());
}

