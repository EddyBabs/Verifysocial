/* eslint-disable @next/next/no-img-element */
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Brand from "@/assets/images/brands/brand.png";
import EllipseGrey from "@/assets/Ellipse 7.png";
import EllipseBlue from "@/assets/Ellipse 6.png";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="flex flex-col gap-6 p-8 sm:pl-40 col-span-1 md:min-w-[500px]">
          <h1 className="text-4xl font-semibold">Online Shopping Reasured</h1>
          <p>
            Stress no more, your shopping just got better. We want to be your
            gateway to a safe online market
          </p>
          <div className="relative">
            <Input className="p-6 max-w-sm rounded-3xl" />
          </div>
        </div>
        <div className="col-span-2 py-10">
          <div className="relative w-full justify-end flex">
            <Image
              src={EllipseBlue.src}
              width={600}
              height={600}
              alt=""
              className="right-8 mt-2 absolute z-10"
            />
            <Image
              src={EllipseGrey.src}
              width={600}
              height={600}
              alt=""
              className="z-20"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#F5F7FF] p-8 md:p-20">
        <div className=" container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card className="max-w-sm rounded-lg shadow" key={index}>
                <a href="#">
                  <img className="rounded-t-lg" src={Brand.src} alt="" />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Glow by Banks
                    </h5>
                  </a>
                  <div className="space-x-4 text-sm">
                    <span>Lagos</span>
                    <span>4.8(20)</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="p-20">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 items-center justify-center">
            <h2 className="text-3xl font-semibold">What We Offer</h2>
            <h5>
              Know what you&apos;re buying, know what you&apos;re doing buisness
              with.
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
