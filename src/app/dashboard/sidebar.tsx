"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Prisma, UserRole } from "@prisma/client";
import { HomeIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

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
  return (
    <div className="flex h-full max-h-screen flex-col gap-2  bg-gray-100/40  dark:bg-gray-800/40 fixed left-0 top-0 w-[280px]">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          prefetch={false}
        >
          <Logo width={110} height={60} className="-ml-8" />
        </Link>
        {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <BellIcon className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button> */}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium ">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            prefetch={false}
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>

          {user.role === UserRole.VENDOR && (
            <>
              <Link
                href="/dashboard/generate-code"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                prefetch={false}
              >
                <HomeIcon className="h-4 w-4" />
                Generate Code
              </Link>
              <Link
                href="/dashboard/reviews"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                prefetch={false}
              >
                <HomeIcon className="h-4 w-4" />
                Reviews
              </Link>
            </>
          )}

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            <HomeIcon className="h-4 w-4" />
            Profile
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            <HomeIcon className="h-4 w-4" />
            Settings
          </Link>
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
