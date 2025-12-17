// router.tsx
import React, { useEffect, useState } from "react";
import FileManager from "@/pages/filemanager";
import Console from "@/pages/Console";

type Route = {
  path: string;
  element: React.ReactNode;
};

const routes: Route[] = [];
routes.push({ path: "/file-manager", element: <FileManager /> });
routes.push({ path: "/", element: <Console /> });

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
