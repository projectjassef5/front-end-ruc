"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, List, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

const menuItems = [
  { href: "/dashboard/consulta", label: "Consultar RUC", icon: Search },
  { href: "/dashboard/listado", label: "Listado de RUCs", icon: List },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Building className="w-8 h-8 text-primary" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <h2 className="font-bold text-lg text-primary">Consulta RUC</h2>
                <p className="text-xs text-muted-foreground">por Victor Cuaresma</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
