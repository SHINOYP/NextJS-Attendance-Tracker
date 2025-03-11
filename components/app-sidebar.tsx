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
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "/tset",

    },
    {
      title: "Building Your Application",
      url: "/tset",

    },
    {
      title: "API Reference",
      url: "/tset",
    },
    {
      title: "Architecture",
      url: "/tset",

    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Documentation</span>

          </div>

        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data?.navMain?.map((item) => (
          <SidebarGroup key={item?.title}>
            <SidebarMenu><SidebarMenuItem>
              <SidebarMenuButton>
                <Link href={item?.url}>
                  {item?.title}
                </Link>
              </SidebarMenuButton></SidebarMenuItem></SidebarMenu>

          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
