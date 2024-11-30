import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { Check } from "lucide-react";
import React, { Fragment } from "react";

interface StepperIndicatorProps {
  activeStep: number;
}

// export type StepperFormKeysType =
//   (typeof STEPPER_FORM_KEYS)[keyof typeof STEPPER_FORM_KEYS][number];

// export type StepperFormValues = {
//   [FieldName in StepperFormKeysType]: FieldName extends
//     | "annualIncome"
//     | "loanAmount"
//     | "repaymentTerms"
//     | "creditScore"
//     ? number
//     : string;
// };

const StepperIndicator = ({ activeStep }: StepperIndicatorProps) => {
  return (
    <div className="flex justify-center items-center">
      {[1, 2, 3].map((step) => (
        <Fragment key={step}>
          <div
            className={clsx(
              "w-[40px] h-[40px] flex justify-center items-center m-[5px] border-[2px] rounded-full",
              step < activeStep && "bg-primary text-white",
              step === activeStep && "border-primary text-primary"
            )}
          >
            {step >= activeStep ? step : <Check className="h-5 w-5" />}
          </div>
          {step !== 3 && (
            <Separator
              orientation="horizontal"
              className={clsx(
                "w-[100px] h-[2px]",
                step <= activeStep - 1 && "bg-primary"
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default StepperIndicator;
