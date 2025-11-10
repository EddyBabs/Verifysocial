import GuestLayout from "@/components/layouts/layout";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestLayout>
      <div className="w-full">{children}</div>
    </GuestLayout>
  );
}
