import Accessories from "@/assets/images/accessories.jpeg";
import FacialsImage from "@/assets/images/facials.jpeg";
import ReviewCard from "@/components/reveiw-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import VendorAvatar from "@/components/vendor-avatar";
import RateVendor from "@/screens/rating-modal";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const VendorId = ({ params }: { params: { vendorId: string } }) => {
  console.log(params.vendorId);
  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">Vendors</h1>
          <Link href="/dashboard/reviews">
            <Button className="text-xl font-semibold md:px-8 md:py-6 rounded-xl">
              View All Review
            </Button>
          </Link>
        </div>
        <div className="relative">
          <Search className="absolute w-6 h-6 top-1/2 left-2 -translate-y-3" />
          <Input placeholder="Search by name" className="pl-10" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2 xl:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="flex justify-between">
                <VendorAvatar />
                <div>
                  <RateVendor />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Image
                    src={Accessories}
                    alt=""
                    className="rounded-xl object-cover w-full h-full aspect-video"
                  />
                </div>
                <div>
                  <Image
                    src={FacialsImage}
                    alt=""
                    className=" rounded-xl object-cover w-full h-full aspect-video"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 xl:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="font-semibold text-3xl">
                  Will you like to patronize this vendor?
                </h1>
                <p className="text-base">
                  Click on any of the social media platform to contact Glow by
                  Banks
                </p>
              </div>
              <div className="flex gap-6 items-center">
                <Link href="#">
                  <div className="flex items-center justify-center flex-col ">
                    <IoLogoWhatsapp className="fill-green-500 h-10 w-10" />
                    <h3 className="text-base">Whatsapp</h3>
                  </div>
                </Link>
                <Link href="#">
                  <div className="flex items-center justify-center flex-col">
                    <FaFacebookSquare className="h-10 w-10 fill-blue-800" />
                    <h3 className="text-base">Facebook</h3>
                  </div>
                </Link>
                <Link href="#">
                  <div className="flex items-center justify-center flex-col">
                    <BsInstagram className="h-10 w-10" />
                    <h3 className="text-base">Instagram</h3>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="p-4">
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold">Reviews</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <ReviewCard key={index} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorId;
