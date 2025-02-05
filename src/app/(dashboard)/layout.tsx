import DashboardLayout from "@/components/layouts/dashboard-layout";
import { getCurrentUserDetails } from "@/data/user";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const { user } = await getCurrentUserDetails();
  if (user.role === UserRole.VENDOR) {
    if (user.vendor?.tier !== "TIER1") {
      redirect("/");
    }
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
