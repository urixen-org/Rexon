import { Files, Search, Settings, Terminal, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigate } from "./Router";

// Menu items.
const items = [
  {
    title: "Console",
    url: "/",
    icon: Terminal,
  },
  {
    title: "File Manager",
    url: "/file-manager",
    icon: Files,
  },
  {
    title: "Player Management",
    url: "#",
    icon: Users,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="dark">
      <SidebarContent className="bg-gray-950 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-2xl text-center justify-center">
            REXON
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.url);
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
