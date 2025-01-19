import { getCurrentUserDetails } from "@/data/user";
import SettingForm from "./setting-form";
import { redirect } from "next/navigation";
import InstagramCallback from "@/components/instagram-callback";

const Settings = async () => {
  const { user } = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/signin");
  }
  return (
    <div className="container mx-auto space-y-6">
      <InstagramCallback />
      <div>
        <h3 className="text-3xl font-semibold">Settings</h3>
      </div>
      <SettingForm user={user} />
    </div>
  );
};

export default Settings;
