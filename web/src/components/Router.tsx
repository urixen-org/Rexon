
import React, { useEffect, useState } from "react";
import FileManager from "@/pages/filemanager";
import Console from "@/pages/Console";
import Playit from "@/pages/Playit"
import Software from "@/pages/Software";

type Route = {
  path: string;
  element: React.ReactNode;
};

const routes: Route[] = [];
routes.push({ path: "/file-manager", element: <FileManager /> });
routes.push({ path: "/", element: <Console /> });
routes.push({ path: "/playit", element: <Playit />})
routes.push({ path: "/software", element: <Software />})

export function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const match = routes.find((r) => r.path === currentPath);
  return <>{match?.element ?? <div>404</div>}</>;
}

export function navigate(path: string) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
