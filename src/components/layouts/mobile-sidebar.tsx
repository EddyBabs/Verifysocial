"use client";

import { Button } from "@/components/ui/button";
import { getSideBar } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { Collapsible } from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

const MobileSidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
  const SIDEBAR_VALUE = getSideBar(user);
  return (
    <>
      {SIDEBAR_VALUE.map((item, index) => {
        const Icon = item.icon;

        if (item.children && item.children.length > 0) {
          return (
            <Collapsible key={index}>
              <SidebarGroup>
                <SidebarGroupLabel className="p-0" asChild>
                  <CollapsibleTrigger>
                    <Icon className="h-5 w-5 mr-2" />
                    {item.value}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarMenuSub className="space-y-2">
                    {item.children.map((subitem: any) => (
                      <SidebarMenuSubItem key={subitem.value}>
                        <SidebarMenuSubButton
                          className="h-fit hover:cursor-pointer"
                          asChild
                        >
                          <Link href={`/vendors?category=${subitem.value}`}>
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
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              { "bg-gray-100": pathname === item.href }
            )}
            prefetch={false}
            key={item.href}
          >
            <Icon className="h-5 w-5" />
            {item.value}
          </Link>
        );
      })}
      <div className="mt-auto p-4 mb-4">
        <Button
          size="sm"
          className="w-full"
          onClick={async () => await signOut({ redirectTo: "/" })}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default MobileSidebar;
