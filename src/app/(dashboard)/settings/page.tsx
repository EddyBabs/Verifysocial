import InstagramCallback from "@/components/instagram-callback";
import { AccountNumberForm } from "@/components/settings/account-number-form";
import { SecurityForm } from "@/components/settings/security-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUserDetails } from "@/data/user";
import { CreditCard, Lock, User } from "lucide-react";
import { redirect } from "next/navigation";
import SettingForm from "./setting-form";
import { cn } from "@/lib/utils";
import { fetchVendorPaymentInfo } from "@/actions/payment-info";

const Settings = async () => {
  const { user } = await getCurrentUserDetails();
  if (!user) {
    redirect("/auth/signin");
  }
  const paymentInfo = await fetchVendorPaymentInfo();
  return (
    <div className="container mx-auto space-y-6">
      <InstagramCallback />
      <div>
        <h3 className="text-3xl font-semibold">Settings</h3>
      </div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList
          className={cn("grid w-full grid-cols-2 md:w-[300px]", {
            "md:w-[400px] grid-cols-3": user.role === "VENDOR",
          })}
        >
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>

          {user.role === "VENDOR" && (
            <TabsTrigger value="payment">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment
            </TabsTrigger>
          )}
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-6">
          {/* <ProfileForm /> */}
          <SettingForm user={user} />
        </TabsContent>
        {user.role === "VENDOR" && (
          <TabsContent value="payment" className="mt-6">
            <AccountNumberForm paymentInfo={paymentInfo.paymentInfo} />
          </TabsContent>
        )}
        <TabsContent value="security" className="mt-6">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
