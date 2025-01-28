import Sidebar from "@/app/(dashboard)/sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCurrentUserDetails } from "@/data/user";
import { MenuIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

import MobileSidebar from "./mobile-sidebar";
const DashboardLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const { user } = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="grid h-screen min-h-screen w-full gap-4 lg:gap-0 lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r lg:block relative">
        <Sidebar user={user} />
      </div>
      <div className="flex flex-col min-h-screen">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="block lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} className="lg:hidden block">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="lg:hidden block">
                <SheetHeader>
                  <SheetTitle>Verify Social</SheetTitle>
                </SheetHeader>

                <div className="grid gap-2 py-6">
                  <MobileSidebar user={user} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
