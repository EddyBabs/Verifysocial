"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getSideBar } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarPanelProps {
  user: Prisma.UserGetPayload<{
    select: {
      fullname: true;
      role: true;
      vendor: { select: { businessAbout: true } };
    };
  }>;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ user }) => {
  const SIDEBAR_VALUE = getSideBar(user);
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarGroup>
            <div className="flex h-[60px] items-center border-b px-6">
              <Link
                href="/home"
                className="flex items-center gap-2 font-semibold"
                prefetch={false}
              >
                <Logo width={20} height={20} className="text-sm" />
              </Link>
            </div>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="space-y-2">
              <SidebarMenu>
                {SIDEBAR_VALUE.map((item, index) => {
                  const Icon = item.icon;
                  if (item.children && item.children.length > 0) {
                    return (
                      <Collapsible key={index} className="group/collapsible">
                        <SidebarGroup>
                          <SidebarGroupLabel className="p-0" asChild>
                            <CollapsibleTrigger className="text-[15px]">
                              <Icon size={50} className="mr-2 h-10 w-10" />
                              {item.value}
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                          </SidebarGroupLabel>
                          <CollapsibleContent>
                            <SidebarMenuSub className="space-y-2">
                              {item.children.map((subitem: any) => (
                                <SidebarMenuSubItem key={subitem.value}>
                                  <SidebarMenuSubButton
                                    className="h-fit hover:cursor-pointer text-[0.8rem] leading-5"
                                    asChild
                                  >
                                    <Link
                                      href={`/vendors?category=${subitem.value}`}
                                    >
                                      {subitem.label}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarGroup>
                      </Collapsible>
                    );
                  }
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        className={cn({
                          "bg-gray-100": pathname === item.href,
                        })}
                      >
                        <Link href={item.href}>
                          <Icon size={20} />
                          {item.value}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-auto p-4 mb-4">
            <Button
              size="sm"
              className="w-full"
              onClick={async () => await signOut({ redirectTo: "/" })}
            >
              Logout
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default SidebarPanel;
