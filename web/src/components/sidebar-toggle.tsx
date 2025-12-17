import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center">
      <Button onClick={() => toggleSidebar()}><Menu /></Button>
    </div>
  );
}
