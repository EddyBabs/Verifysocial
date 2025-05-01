/* eslint-disable @next/next/no-img-element */
import AmicoSvg from "@/assets/amico.svg";
import noImagePlacehoder from "@/assets/images/no-image-placehoder.webp";
import VerifySocialVideo from "@/assets/verify social video.gif";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VendorSearchInput from "@/components/vendor-search-input";
import { auth } from "@/lib/auth";
import { database } from "@/lib/database";
import { MagnifyingGlassIcon, StarFilledIcon } from "@radix-ui/react-icons";

import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaShieldHalved } from "react-icons/fa6";

const offers = [
  {
    icon: FaShieldHalved,
    title: "Authenticate",
    description:
      "Our services revolves around ensuring your shopping experience by highlighting and showcasing legitimate businesses.",
  },
  {
    icon: Lock,
    title: "Security",
    description:
      "Secure your shopping experience with our renowned transaction monitoring ability.",
  },
  {
    icon: FaShieldHalved,
    title: "Trust",
    description:
      "We thrive on shared trust and responsibility amongst all parties. A trustworthy market place is worth going the extra mile for, that's why we are here!",
  },
];

export default async function Home() {
  const session = await auth();
  const bestSellerVendors = await database.vendor.findMany({
    take: 3,
    include: {
      User: {
        select: {
          address: {
            select: {
              state: true,
              country: true,
              street: true,
              city: true,
            },
          },
        },
      },
      Product: {
        take: 1,
        select: {
          image: true,
        },
      },
    },
  });
  return (
    <div className="w-full">
      <div className="container mx-auto mt-10 px-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-2.5 left-6 w-5 h-5" />
          {/* <Input
            className="p-6 w-full rounded-3xl pl-12"
            placeholder="Search"
          /> */}
          <VendorSearchInput
            className="p-6 w-full pl-12"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="grid relative overflow-hidden grid-cols-1 lg:grid-cols-3 lg:gap-4 items-center">
        <div className="hidden w-full h-full justify-end lg:flex">
          <div className="w-[650px] h-[612px] absolute -bottom-8 -left-1/4 xl:-left-40 translate-x-5  rounded-full bg-primary"></div>
          <div className="w-[650px] h-[612px] absolute -bottom-8 -left-1/4 xl:-left-40 rounded-full bg-white flex justify-center items-center overflow-hidden shadow-[10px_-8px_5px_0px_rgba(0,0,0,0.6)]">
            <Image
              src={VerifySocialVideo}
              alt=""
              className="h-[calc(100%+100px)] object-cover"
            />
          </div>
        </div>

        <div className="min-h-[16rem] flex justify-center items-center lg:hidden">
          <Image
            src={VerifySocialVideo}
            alt=""
            className="h-[calc(100%+100px)] object-cover"
          />
        </div>

        <div className="flex col-span-3 lg:col-span-2 flex-col gap-6 px-8 py-0 lg:py-8 xl:pl-40  md:min-w-[500px] min-h-[300px] md:min-h-[650px] justify-center">
          <h1 className="text-3xl sm:text-7xl font-semibold font-montserrat_alternates">
            Online Shopping Reassured
          </h1>
          <p className="text-lg italic">
            Stress no more, your shopping just got better. We want to be your
            gateway to a safe online market place
          </p>

          {!session?.user && (
            <div>
              <Link href="/auth/signup" passHref>
                <Button className="rounded-lg w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#F5F7FF] p-8 md:p-20">
        <div className=" container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bestSellerVendors.map((vendor) => (
              <Card
                className="max-w-sm rounded-lg shadow-none border-none bg-transparent flex flex-col justify-center items-center mx-auto"
                key={vendor.id}
              >
                <Link href={`/vendor/${vendor.id}`}>
                  <img
                    className="rounded-t-lg aspect-square rounded-2xl object-cover max-h-[270px]"
                    src={vendor.Product?.[0]?.image || noImagePlacehoder.src}
                    alt=""
                  />
                </Link>
                <div className="py-5">
                  <a href="#">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      {vendor.businessName}
                    </h5>
                  </a>
                  <div className="space-x-2 flex items-center text-sm">
                    <span>{vendor.User.address?.city}</span>
                    <StarFilledIcon className="text-[#FFDD55]" />
                    <span>
                      {vendor.rating.toFixed(1)}
                      {/* <span className="ml-1">({vendor.reviewCount})</span> */}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-40">
        <div className="flex flex-col gap-20 items-center justify-center px-4">
          <div className="container mx-auto flex items-center flex-col gap-4 text-center">
            <h2 className="text-3xl font-semibold">What We Offer</h2>
            <h5>
              Know what you&apos;re buying, know what you&apos;re doing business
              with.
            </h5>
          </div>

          <div className="w-full">
            <div className=" md:border-b-4 border-primary w-full">
              <div className="container mx-auto text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:border-l-0 border-primary ">
                  {offers.map((offer, index) => (
                  
                      <div
                        key={`${offer.title}-${index}`}
                        className="border max-w-[280px] md:max-w-none mx-auto rounded-xl md:border-l-4 hover:bg-primary hover:text-secondary md:before:w-6 md:before:h-6 md:before:absolute md:before:-left-3.5 md:before:-top-2 md:before:bg-primary before:rounded-full relative md:border-primary p-5 pb-10"
                      >
                        <div className="flex items-center justify-center mb-4">
                          <offer.icon className="h-10 w-10" />
                        </div>
                        <h1 className="font-semibold text-xl mb-4">
                          {offer.title}
                        </h1>
                        <p>{offer.description}</p>
                      </div>
                    
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="flex flex-col gap-4 justify-center items-center">
              <h2 className="text-3xl font-semibold">Get in touch with us.</h2>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>

                <Input
                  placeholder="Enter your name"
                  id="name"
                  name="name"
                  autoComplete="name"
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="xyzzz@gmail.com"
                  name="email"
                  id="email"
                  autoComplete="email"
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Your message</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  autoComplete="off"
                  rows={5}
                />
              </div>
              <Button className="bg-gradient-to-r w-full from-[#003399] to-[#2C64D4]">
                Send
              </Button>
            </div>
            <div>
              <div className="flex items-center w-full justify-center">
                <Image src={AmicoSvg} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
