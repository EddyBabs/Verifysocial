"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HomeIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiSettings } from "react-icons/ci";
import { FaBarcode } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";

const MobileSidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
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
            href: "/",
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
            href: "/settings",
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
