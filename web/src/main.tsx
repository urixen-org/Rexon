/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {Router} from "@/components/Router.tsx";
import Passcode from "./components/Passcode-Input.tsx";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import { PasscodeProvider, usePasscode } from "./lib/Passcode.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "./components/app-sidebar";

function Root() {
  const { passcode } = usePasscode();

  return (
    <>
      {passcode ? <Router /> : <Passcode />}
      <Toaster theme="dark" />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PasscodeProvider>
      <SidebarProvider defaultOpen={false} className="">
        {/*<Root /> */}
        <Router />
        <AppSidebar />
      </SidebarProvider>
    </PasscodeProvider>
  </StrictMode>
);
