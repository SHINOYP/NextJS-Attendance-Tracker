"use client"
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
import { Users, ClipboardCheck, UserPlus, User, LogOut, Volleyball } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"



// Navigation data for the sports club attendance system
const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
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
      url: "/",
      icon: <User className="size-4" />
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();



  const userRole = session?.user?.role || "CAPTAIN"; // Replace with actual role extraction logic

  const filteredNav = sidebarData.navMain.filter(item => {
    if (userRole === "COACH") {
      // Coach can access everything
      return true;
    } else if (userRole === "CAPTAIN") {
      // Captain can't access certain management features
      return item.url !== "/manage-students" && item.url !== "/take-attendance";
    }
    return true;
  });
  const handleLogOut = () => {
    signOut()
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Volleyball className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">NSS PULSE</span>
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
              <SidebarMenuButton onClick={handleLogOut} >
                <a className="flex items-center gap-2 text-red-500">
                  <LogOut className="size-4" />
                  Logout
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}