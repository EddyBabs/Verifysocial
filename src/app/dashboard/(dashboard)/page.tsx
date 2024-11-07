import Accessories from "@/assets/images/accessories.jpeg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import VendorAvatar from "@/components/vendor-avatar";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">Vendors</h1>
        </div>
        <div className="relative">
          <Search className="absolute w-6 h-6 top-1/2 left-2 -translate-y-3" />
          <Input placeholder="Search by name" className="pl-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Explore</CardTitle>
          </CardHeader>
          <CardContent className="">
            {/* <div className="space-y-6"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <Link href={"/dashboard/vendor/1"} key={index}>
                  <div className="group cursor-pointer">
                    <div className="mb-4 overflow-hidden">
                      <Image
                        src={Accessories}
                        alt=""
                        className="group-hover:scale-105 transition-all rounded-xl object-cover w-full h-full aspect-video overflow-hidden"
                      />
                    </div>

                    <VendorAvatar />
                  </div>
                </Link>
              ))}
            </div>
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
                    <VendorAvatar />
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

export default Dashboard;
