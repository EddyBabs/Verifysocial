import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Ratings from "@/components/ui/ratings";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h4 className="text-xl font-semibold">Reviews & Ratings</h4>
          <Link href="/dashboard/generate-code">
            <Button>Generate Code</Button>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <h1 className="font-extrabold text-6xl">4.8</h1>
          <div className="space-y-4 w-full sm:w-2/6">
            <Progress value={100} />
            <Progress value={90} />
            <Progress value={70} />
            <Progress value={50} />
            <Progress value={30} />
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold">What Customers Saying</h3>
        <div>
          {Array.from({ length: 3 }, (_, index) => (
            <VendorReviewVertical key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const VendorReviewVertical = () => {
  return (
    <div className="space-y-2 border-b-2 py-4">
      <h4>Daniel Ejike</h4>
      <p>10 - 9 - 2024</p>
      <Ratings variant="yellow" value={4} />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus
        corporis, animi sequi iure nam tempora non.
      </p>
    </div>
  );
};

export default Page;
