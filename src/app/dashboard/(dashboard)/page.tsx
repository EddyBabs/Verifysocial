import { getVendors } from "@/actions/vendor";
import Accessories from "@/assets/images/accessories.jpeg";
import BecomeAVendor from "@/components/become-a-vendor";
import SearchVendors from "@/components/search-vendors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VendorAvatar from "@/components/vendor-avatar";
import VendorProfile from "@/components/vendor-profile";
import { getCurrentUserDetails } from "@/data/user";
import { UserRole } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const Dashboard = async () => {
  const { user, ninVerified } = await getCurrentUserDetails();
  if (user?.role === UserRole.VENDOR) {
    if (user.vendor?.tier === "TIER1") {
      return <VendorProfile user={user} />;
    }
    return <BecomeAVendor user={user} ninVerified={ninVerified} />;
  }
  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">Vendors</h1>
        </div>
        <SearchVendors />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Explore</CardTitle>
          </CardHeader>
          <CardContent className="">
            {/* <div className="space-y-6"> */}
            <VendorList />
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>All Cloth Vendors</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <div
                    key={index}
                    className="py-4 border-b-2 border-accent last:border-b-0"
                  >
                    <VendorAvatar vendor={user.vendor} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const VendorList = async () => {
  const vendors = await getVendors();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {vendors.map((vendor, index) => (
        <Link href={`/dashboard/vendor/${vendor.id}`} key={index}>
          <div className="group cursor-pointer">
            <div className="mb-4 overflow-hidden">
              <Image
                src={Accessories}
                alt=""
                className="group-hover:scale-105 transition-all rounded-xl object-cover w-full h-full aspect-video overflow-hidden"
              />
            </div>

            <VendorAvatar vendor={vendor} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Dashboard;
