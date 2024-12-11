import AccessoryImage from "@/assets/images/accessories.jpeg";
import CaptionImage from "@/assets/images/captionImage.jpeg";
import FacialsImage from "@/assets/images/facials.jpeg";
import ReviewCard from "@/components/reveiw-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FiAward } from "react-icons/fi";

const Profile = () => {
  return (
    <div>
      <div>
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Hi, Glow by Banks</h4>
          <div className="flex items-center justify-between">
            {/* <VendorAvatar /> */}
            <div className="">
              <Button
                variant={"ghost"}
                className="flex relative hover:bg-transparent"
              >
                <FiAward
                  size={50}
                  className="text-[#AF8A6F] z-20 fill-background"
                  strokeWidth={3}
                />
                <h1 className="absolute text-[#AF8A6F] left-[37px] top-0 z-30 font-extrabold ">
                  1
                </h1>

                <div className="-ml-6">
                  <span className="bg-[#AF8A6F] p-2 text-background z-10 rounded-xl pl-6">
                    Upgrade to tier 2
                  </span>
                </div>
              </Button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <div>
                <Image
                  src={AccessoryImage}
                  alt=""
                  className="rounded-xl w-full h-full aspect-video object-cover"
                />
              </div>
              <div>
                <Image
                  src={CaptionImage}
                  alt=""
                  className="rounded-xl w-full h-full aspect-video object-cover"
                />
              </div>
              <div>
                <Image
                  src={FacialsImage}
                  alt=""
                  className="rounded-xl w-full h-full aspect-video object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <h3 className="text-xl font-semibold">What Customers Saying</h3>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 3 }, (_, index) => (
                  <ReviewCard key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
