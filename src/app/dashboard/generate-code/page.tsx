import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import React from "react";

const GenerateCode = () => {
  return (
    <div>
      <div className="container">
        <div className="space-y-14">
          <div>
            <h4 className="text-xl font-semibold">Generate Codes</h4>
            <h6 className="font-semibold">
              Generate codes and send to your customers to confirm your
              verification
            </h6>
          </div>
          <div></div>
          <div>
            <div className="flex w-full border items-center  border-primary rounded-xl">
              <Button className="h-full py-2.5 rounded-r-none">
                Generate New Code
              </Button>
              <div className="flex-1 ml-4">
                <span>AEFGGFJDJDKS</span>
              </div>
              <div className="p-2 px-4 border-l border-primary hover:cursor-pointer">
                <CopyIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCode;
