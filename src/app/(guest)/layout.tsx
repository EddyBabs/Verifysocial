import DashboardLayout from "@/components/layouts/dashboard-layout";
import GuestLayout from "@/components/layouts/layout";
import { auth } from "@/lib/auth";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  return <GuestLayout>{children}</GuestLayout>;
}
