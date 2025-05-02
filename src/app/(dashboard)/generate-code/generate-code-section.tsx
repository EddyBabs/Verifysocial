"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Code } from "@prisma/client";
import { Check, CopyIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface GenerateCodeSectionTypes {
  code: Code;
}

const GenerateCodeSection: React.FC<GenerateCodeSectionTypes> = ({ code }) => {
  const [copied, setCopied] = useState(false);

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
          <span>{code.value}</span>
        </div>
        <Button
          variant={"ghost"}
          className="p-2 px-4 relative border-l rounded-none border-primary hover:cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(code.value);
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
