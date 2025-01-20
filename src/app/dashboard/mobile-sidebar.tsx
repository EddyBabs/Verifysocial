"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { HomeIcon } from "@radix-ui/react-icons";
import { VscPreview } from "react-icons/vsc";
import { IoMdAnalytics } from "react-icons/io";
import { FaBarcode } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { MdOutlineCategory } from "react-icons/md";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MobileSidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
  const SIDEBAR_VALUE = [
    ...(user.role === "VENDOR"
      ? [
          {
            icon: HomeIcon,
            href: "/dashboard",
            value: "Profile",
          },
          {
            icon: VscPreview,
            href: "/dashboard/reviews",
            value: "Reviews",
          },
          {
            icon: IoMdAnalytics,
            href: "#",
            value: "Analytics",
          },
          {
            icon: FaBarcode,
            href: "/dashboard/generate-code",
            value: "Generate Code",
          },
          {
            icon: CiSettings,
            href: "/dashboard/settings",
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
            href: "#",
            value: "Category",
            children: [],
          },
          {
            icon: CiSettings,
            href: "/dashboard/settings",
            value: "Settings",
          },
        ]),
  ];

  return (
    <>
      {SIDEBAR_VALUE.map((bar) => {
        const Icon = bar.icon;
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
    </>
  );
};

export default MobileSidebar;
