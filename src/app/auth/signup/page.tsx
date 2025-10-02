import { getCurrentUser } from "@/data/user";
import { redirect } from "next/navigation";
import SignupPageClient from "./page-client";

const SignUp = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }
  return <SignupPageClient />;
};

export default SignUp;
