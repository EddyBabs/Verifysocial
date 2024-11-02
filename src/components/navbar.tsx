import Link from "next/link";
import React from "react";
import Logo from "./logo";

const Navbar = () => {
  return (
    <div className="sticky top-0 inset-x-0 w-full transition-all bg-white z-50">
      <div className="container mx-auto ">
        <div className="navbar bg-base-100 px-0 sm:px-4 justify-between flex items-center">
          <div className="">
            <Link href="/" passHref>
              <Logo />
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
                  className="btn btn-secondary rounded-xl bg-primary text-secondary py-3 px-2 sm:px-4 btn-md"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
