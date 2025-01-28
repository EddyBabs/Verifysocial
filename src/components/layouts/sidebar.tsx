"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import categories from "@/data/categories";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { HomeIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { CiSettings } from "react-icons/ci";
import { FaBarcode } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";

interface SidebarProps {
  user: Prisma.UserGetPayload<{
    select: {
      fullname: true;
      role: true;
      vendor: { select: { buisnessAbout: true } };
    };
  }>;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const SIDEBAR_VALUE = [
    ...(user.role === "VENDOR"
      ? [
          {
            icon: HomeIcon,
            href: "/",
            value: "Profile",
          },
          {
            icon: VscPreview,
            href: "/reviews",
            value: "Reviews",
          },
          {
            icon: IoMdAnalytics,
            href: "#",
            value: "Analytics",
          },
          {
            icon: FaBarcode,
            href: "/generate-code",
            value: "Generate Code",
          },
          {
            icon: CiSettings,
            href: "/settings",
            value: "Settings",
          },
        ]
      : [
          {
            icon: HomeIcon,
            href: "/dashboard",
            value: "Home",
          },
          {
            icon: MdOutlineCategory,
            href: "/vendors",
            value: "Category",
            children: categories,
          },
          {
            icon: CiSettings,
            href: "/settings",
            value: "Settings",
          },
        ]),
  ];
  const pathname = usePathname();
  return (
    <div className="flex h-full max-h-screen flex-col gap-2  bg-gray-100/40  dark:bg-gray-800/40 fixed left-0 top-0 w-[280px]">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link
          href="/home"
          className="flex items-center gap-2 font-semibold"
          prefetch={false}
        >
          <Logo width={20} height={20} className="text-sm" />
        </Link>
        {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <BellIcon className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button> */}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 gap-4 text-sm font-medium ">
          {SIDEBAR_VALUE.map((bar) => {
            const Icon = bar.icon;
            if (bar.children?.length) {
              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                          { "bg-gray-100": pathname === bar.href }
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {bar.value}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Categories</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {bar.children.map((item) => (
                        <Link
                          key={item.value}
                          href={`/vendors?category=${item.value}`}
                          passHref
                        >
                          <DropdownMenuItem>{item.label}</DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              );
            }
            return (
              <Link
                href={bar.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  { "bg-gray-100": pathname === bar.href }
                )}
                prefetch={false}
                key={bar.href}
              >
                <Icon className="h-5 w-5" />
                {bar.value}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 mb-4">
        <Button
          size="sm"
          className="w-full"
          onClick={async () => await signOut({ redirectTo: "/" })}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
