"use client";

import Amico from "@/assets/amico.png";
import AuthCart from "@/assets/AuthCart.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, User } from "lucide-react";
import { useState } from "react";
import SignUpForm from "../../../components/signup-form";
import VerifyEmailForm from "../../../components/verify-email-form";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/logo";

export default function SignupPageClient() {
  const [selectedRole, setSelectedRole] = useState<"user" | "vendor" | null>(
    null
  );

  const handleRoleSelect = (role: "user" | "vendor") => {
    setSelectedRole(role);
  };

  if (!selectedRole) {
    return <ChooseRolePage handleRoleSelect={handleRoleSelect} />;
  }
  return (
    <div className="min-h-screen w-screen relative">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="col-span-1  min-h-screen flex flex-col items-center">
          <SignupPageForm
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
          ;
        </div>
        <div className="hidden text-primary col-span-1 md:flex flex-col relative  items-center justify-center h-full w-full">
          <div className="absolute top-20 text-center z-20">
            <h2 className=" text-3xl font-semibold">Shop With Certainty</h2>
            <h5>All in one access to verified Business</h5>
          </div>
          <Image
            src={AuthCart}
            alt="cart logo"
            className="absolute right-0 top-0 z-10 hidden xl:block"
          />
          <Image src={Amico} alt="" />
        </div>
      </div>
    </div>
  );
}

function ChooseRolePage({
  handleRoleSelect,
}: {
  handleRoleSelect: (role: "user" | "vendor") => void;
}) {
  return (
    <div className="container max-w-5xl mx-auto h-screen py-10 px-4 md:py-16">
      <div className="mx-auto max-w-md text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <Link href="/" passHref>
            <Logo />
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="mt-2 text-muted-foreground">
          Choose your account type to get started
        </p>
      </div>
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className="cursor-pointer border-2 hover:border-primary transition-colors"
            onClick={() => handleRoleSelect("user")}
          >
            <CardHeader className="space-y-1 flex flex-row items-start">
              <div className="mr-4 rounded-full bg-primary/10 p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Individual User</CardTitle>
                <CardDescription>
                  Sign up as a regular user to browse and purchase products
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Browse all available products</li>
                <li>Make purchases and track orders</li>
                <li>Save favorites and create wishlists</li>
                <li>Receive personalized recommendations</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleRoleSelect("user")}
              >
                Sign up as User
              </Button>
            </CardFooter>
          </Card>

          <Card
            className="cursor-pointer border-2 hover:border-primary transition-colors"
            onClick={() => handleRoleSelect("vendor")}
          >
            <CardHeader className="space-y-1 flex flex-row items-start">
              <div className="mr-4 rounded-full bg-primary/10 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Vendor</CardTitle>
                <CardDescription>
                  Sign up as a vendor to sell products on our platform
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>List and manage your products</li>
                <li>Track sales and inventory</li>
                <li>Access vendor analytics dashboard</li>
                <li>Receive direct customer inquiries</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleRoleSelect("vendor")}
              >
                Sign up as Vendor
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SignupPageForm({
  setSelectedRole,
  selectedRole,
}: {
  selectedRole: "user" | "vendor";
  setSelectedRole: (role: "user" | "vendor" | null) => void;
}) {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  if (step === "verify") {
    return <VerifyEmailForm />;
  }

  return (
    <SignUpForm
      setStep={setStep}
      selectedRole={selectedRole}
      setSelectedRole={setSelectedRole}
    />
  );
}
