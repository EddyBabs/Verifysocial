/* eslint-disable @next/next/no-img-element */
import AmicoSvg from "@/assets/amico.svg";
import Brand from "@/assets/images/brands/brand.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MagnifyingGlassIcon, StarFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import VerifySocialVideo from "@/assets/verify social video.gif";

const offers = [
  {
    title: "Authenticate",
    description:
      "Our services revolves around ensuring your shopping experience by highlighting and showcasing legitimate businesses.",
  },
  {
    title: "Security",
    description:
      "Secure your shopping experience with our renowned transaction monitoring ability.",
  },
  {
    title: "Trust",
    description:
      "We thrive on shared trust and responsibility amongst all parties. A trustworthy market place is worth going the extra mile for, that's why we are here!",
  },
];

export default function Home() {
  return (
    <div>
      <div className="container mx-auto mt-10 px-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-2.5 left-6 w-5 h-5" />
          <Input
            className="p-6 w-full rounded-3xl pl-12"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="grid relative overflow-hidden grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        <div className="hidden w-full h-full justify-end lg:flex">
          {/* <Image
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
            /> */}
          <div className="w-[650px] h-[612px] absolute -bottom-8 -left-1/4 xl:-left-40 translate-x-5  rounded-full bg-primary"></div>
          <div className="w-[650px] h-[612px] absolute -bottom-8 -left-1/4 xl:-left-40 rounded-full bg-white flex justify-center items-center overflow-hidden shadow-[10px_-8px_5px_0px_rgba(0,0,0,0.6)]">
            <Image
              src={VerifySocialVideo}
              alt=""
              className="h-[calc(100%+100px)] object-cover"
            />
          </div>
          {/* <video
            className="z-50 absolute bottom-24 left-10 h-[300px] aspect-video"
            autoPlay
            muted
            controls
          >
            <source src={"/video/sec[ure-images.mp4"} />
          </video> */}
        </div>

        <div className="flex col-span-3 lg:col-span-2 flex-col gap-6 p-8 xl:pl-40  md:min-w-[500px] min-h-[650px] justify-center">
          <h1 className="text-6xl sm:text-7xl font-semibold font-montserrat_alternates">
            Online Shopping Reasured
          </h1>
          <p className="text-2xl">
            Stress no more, your shopping just got better. We want to be your
            gateway to a safe online market
          </p>
          <div className="flex flex-col stretch gap-8">
            <Link href="/auth/signup" className="w-full" passHref>
              <Button className="rounded-2xl w-full">Get Started</Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button
                className="rounded-2xl border-primary text-primary w-full"
                variant={"outline"}
              >
                Become A Vendor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#F5F7FF] p-8 md:p-20">
        <div className=" container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                className="max-w-sm rounded-lg shadow-none border-none bg-transparent"
                key={index}
              >
                <a href="#">
                  <img className="rounded-t-lg" src={Brand.src} alt="" />
                </a>
                <div className="py-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Glow by Banks
                    </h5>
                  </a>
                  <div className="space-x-2 flex items-center text-sm">
                    <span>Lagos</span>
                    <StarFilledIcon className="text-[#FFDD55]" />
                    <span> 4.8(20)</span>
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
              Know what you&apos;re buying, know what you&apos;re doing buisness
              with.
            </h5>
          </div>

          <div className="w-full">
            <div className=" md:border-b-4 border-primary w-full">
              <div className="container mx-auto text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-l-4 md:border-l-0 border-primary ">
                  {offers.map((offer) => (
                    <div
                      key={offer.title}
                      className="md:border-l-4 before:w-6 before:h-6 before:absolute before:-left-3.5 before:-top-2 before:bg-primary before:rounded-full relative border-primary p-5 pb-10"
                    >
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
            <div className="flex flex-col gap-4 justify-center">
              <h2 className="text-3xl font-semibold">Get in touch with us.</h2>
              <h5>
                Know what you&apos;re buying, know what you&apos;re doing
                buisness with.
              </h5>

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
              <Button>Send</Button>
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
