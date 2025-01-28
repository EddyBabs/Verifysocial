import React from "react";
import Navbar from "../navbar";
import { Button } from "../ui/button";

function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {children}
        </main>
        <footer className="bg-primary pt-32 pb-8">
          <div className="container mx-auto text-white">
            <div className="space-y-6">
              <p className="">Designed and Developed by</p>
              <div className="flex gap-6">
                <div className="space-x-4">
                  <Button className="bg-white text-black">Verify Social</Button>
                  <Button className="bg-green-400">Chat with Us</Button>
                </div>
                <p>Copyright &copy; 2024, All Right Reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default GuestLayout;
