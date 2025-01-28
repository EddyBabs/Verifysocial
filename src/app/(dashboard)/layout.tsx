import DashboardLayout from "@/components/layouts/dashboard-layout";
import React, { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
