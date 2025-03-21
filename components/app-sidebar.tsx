import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Users, ClipboardCheck, UserPlus, User, LogOut } from "lucide-react"
import Link from "next/link"

// Navigation data for the sports club attendance system
const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <Users className="size-4" />
    },
    {
      title: "Take Attendance",
      url: "/take-attendance",
      icon: <ClipboardCheck className="size-4" />
    },
    {
      title: "View Reports",
      url: "/reports",
      icon: <ClipboardCheck className="size-4" />
    },
    {
      title: "Manage Students",
      url: "/manage-students",
      icon: <UserPlus className="size-4" />
    },
    {
      title: "Account",
      url: "/account",
      icon: <User className="size-4" />
    },
  ],
}

export function AppSidebar({ userRole = "captain", ...props }: React.ComponentProps<typeof Sidebar> & { userRole?: string }) {
  // Filter menu items based on user role
  const filteredNav = sidebarData.navMain.filter(item => {
    if (userRole === "coach") {
      // Coach can access everything
      return true;
    } else if (userRole === "captain") {
      // Captain can't access certain management features
      return item.url !== "/manage-students" || item.url === "/take-attendance";
    }
    return true;
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Users className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Sports Club</span>
            <span className="text-xs text-muted-foreground">Attendance System</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {filteredNav.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ))}

        {/* Logout option at the bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link href="/logout" className="flex items-center gap-2 text-red-500">
                  <LogOut className="size-4" />
                  Logout
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}