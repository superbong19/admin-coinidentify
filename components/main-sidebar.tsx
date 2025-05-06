"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CoinsIcon, LayoutGridIcon, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function MainSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-14 flex items-center px-4 border-b">
        <div className="flex items-center gap-2">
          <CoinsIcon className="h-6 w-6" />
          <span className="font-semibold">Coin Collector Admin</span>
        </div>
        <div className="md:hidden ml-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/catalogs")}
              tooltip="Catalogs"
            >
              <Link href="/catalogs">
                <LayoutGridIcon className="h-4 w-4" />
                <span>Catalogs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/offical-series")}
              tooltip="Office Series"
            >
              <Link href="/offical-series">
                <LayoutGridIcon className="h-4 w-4" />
                <span>Office Series</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/coins")}
              tooltip="Coins"
            >
              <Link href="/coins">
                <CoinsIcon className="h-4 w-4" />
                <span>Coins</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/transactions")}
              tooltip="Transactions"
            >
              <Link href="/transactions">
                <CoinsIcon className="h-4 w-4" />
                <span>Transactions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
