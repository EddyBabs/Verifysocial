"use client";
import { getNewCode } from "@/actions/code";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Order } from "@prisma/client";
import { Check, CopyIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";

interface GenerateCodeSectionTypes {
  order: Order;
}

const GenerateCodeSection: React.FC<GenerateCodeSectionTypes> = ({ order }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  // const handleNewCode = () => {
  //   startTransition(async () => {
  //     await getNewCode().then((response) => {
  //       if (response.success) {
  //         toast({ description: response.success });
  //         router.refresh();
  //       } else {
  //         toast({ description: response.error, variant: "destructive" });
  //       }
  //     });
  //   });
  // };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div>
      <div className="flex w-full border items-center  border-primary rounded-xl">
        <div className="flex-1 ml-4">
          <span>{order.code}</span>
        </div>
        <Button
          variant={"ghost"}
          className="p-2 px-4 relative border-l rounded-none border-primary hover:cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/vendor/${order.vendorId}?vendorcode=${order.code}`
            );
            setCopied(true);
          }}
        >
          <CopyIcon
            className={cn("transition-all ease-in-out delay-300 mr-1")}
            strokeDashoffset={copied ? -50 : 0}
            strokeDasharray={50}
          />
          <Check
            className={cn(
              "transition-all ease-in-out delay-300 text-green-500 mr-1 absolute left-4"
            )}
            strokeDashoffset={copied ? 0 : -50}
            strokeDasharray={50}
          />
        </Button>
      </div>
    </div>
  );
};

export default GenerateCodeSection;
