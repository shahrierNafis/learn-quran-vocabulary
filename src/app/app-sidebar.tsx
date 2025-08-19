"use client";
import { Home, ArrowLeftRight, LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Preference from "./Preference";
import ReadQuranBtn from "./ReadQuranBtn";
import Link from "@/components/ui/Link";
import { usePathname } from "next/navigation";
import AdDialog from "@/components/Ad/AdDialog";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Word Order Exercise",
    url: "/wordOrderExercise",
    icon: ArrowLeftRight,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={pathname == item.url ? "#" : item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}{" "}
              <Preference />
              <ReadQuranBtn />
              <AdDialog />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarTrigger className="mx-auto mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
