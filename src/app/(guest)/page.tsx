import { auth } from "@/lib/auth";
import AuthHome from "./components/auth-home";
import Home from "./components/home";

const Page = async () => {
  const session = await auth();
  if (session?.user) return <AuthHome />;
  return <Home />;
};

export default Page;
