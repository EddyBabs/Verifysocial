import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BellIcon, HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid h-screen min-h-screen w-full gap-4 lg:gap-0 lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r lg:block relative">
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
              <Link
                href="/dashboard/reviews"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                prefetch={false}
              >
                <HomeIcon className="h-4 w-4" />
                Reviews
              </Link>
              <Link
                href="/dashboard/become-a-vendor"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                prefetch={false}
              >
                <HomeIcon className="h-4 w-4" />
                Become a vendor
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                prefetch={false}
              >
                <HomeIcon className="h-4 w-4" />
                Profile
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4 mb-4">
            <Button size="sm" className="w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          {/* <Link
            href="#"
            className="lg:hidden flex items-center gap-2 font-semibold"
            prefetch={false}
          >
            <Package2Icon className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
              >
                <img
                  src="/placeholder.svg"
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt="Avatar"
                  style={{ aspectRatio: "32/32", objectFit: "cover" }}
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
