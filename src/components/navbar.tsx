import { getCurrentUser } from "@/data/user";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = async () => {
  const currentUser = await getCurrentUser(false);
  return (
    <div className="sticky top-0 inset-x-0 w-full transition-all bg-white z-50">
      <div className="container mx-auto ">
        <div className="navbar bg-base-100 px-4 justify-between flex items-center overflow-hidden">
          <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"}>
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-x-hidden">
                {/* <Link href="/" prefetch={false}>
                  <Logo className="sr-only" />
                </Link> */}
                <div className="grid gap-2 py-6">
                  <Link
                    href="#"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Home
                  </Link>

                  <Link
                    href="#"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Contact Us
                  </Link>

                  <Link
                    href="/auth/signin"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="-ml-10">
            <Link href="/" passHref>
              <Logo className="xs:sr-only" />
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="btn inline-block">
              Home
            </Link>
            <Link href="/" className="btn inline-block">
              Contact Us
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal flex items-center gap-2 sm:gap-4">
              {/* {env.darkModeEnabled && (
            <li>
              <button
                className="bg-none p-0 rounded-lg flex items-center justify-center"
                onClick={toggleTheme}
              >
                <selectedTheme.icon className="w-5 h-5" />
              </button>
            </li>
          )} */}
              {!currentUser ? (
                <>
                  <li>
                    <Link
                      href="/auth/signin"
                      className="btn btn-md py-3 px-2 sm:px-4 hidden md:inline-block"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/signup"
                      className="btn btn-secondary rounded-xl bg-primary text-secondary py-2 px-3 sm:px-4 btn-md"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/dashboard"
                    className="btn btn-secondary rounded-xl bg-primary text-secondary py-3 px-2 sm:px-4 btn-md"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
