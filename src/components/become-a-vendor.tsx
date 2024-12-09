"use client";
import { sendBuisnessVerification, verifyNIN } from "@/actions/buisness";
import BuisnessDetailsForm from "@/components/buisness-details-form";
import PersonalDetailsForm from "@/components/personal-details-form";
import StepperIndicator from "@/components/stepper-indicator";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  becomeAVendorForm1,
  becomeAVendorForm2,
  becomeAVendorForm3,
} from "@/schemas/become-a-vendor";
import Verification from "@/screens/verification";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const combinedSchema = z.object({
  step1: becomeAVendorForm1,
  step2: becomeAVendorForm2,
  step3: becomeAVendorForm3,
});

export type FormValues = z.infer<typeof combinedSchema>;

function getStepContent(step: number) {
  switch (step) {
    case 1:
      return <PersonalDetailsForm />;
    case 2:
      return <BuisnessDetailsForm />;
    case 3:
      return <Verification />;
    default:
      return "Unknown step";
  }
}

interface BecomeAVendorProps {
  user: User;
}

const BecomeAVendor: React.FC<BecomeAVendorProps> = ({ user }) => {
  const [activeStep, setActiveStep] = useState(1);
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const methods = useForm<FormValues>({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      step1: {
        firstname: user.fullname.split(" ")[0],
        lastname:
          user.fullname.split(" ").length > 1
            ? user.fullname.split(" ")[1]
            : "",
        email: user.email,
        phone: "",
        nin: "",
        pin: "",
      },
      step2: {
        buisnessName: "",
        buisnessAbout: "",
        socialPlatform: [{ platform: "", url: "" }],
      },
      step3: {
        otp: "",
      },
    },
    mode: "onTouched",
  });

  const {
    trigger,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const handleNext = () => {
    startTransition(async () => {
      const currentStepKey = `step${activeStep}` as keyof FormValues;
      const isValid = await trigger(currentStepKey);

      if (activeStep === 1 && isValid) {
        const ninValue = getValues("step1.nin");
        const ninResponse = await verifyNIN(ninValue);
        if (ninResponse?.error) {
          toast({
            variant: "destructive",
            description: ninResponse.error,
          });
          return;
        } else {
          toast({
            description: ninResponse.success,
          });
        }
      }
      if (activeStep === 2 && isValid) {
        try {
          const response = await sendBuisnessVerification(
            `${getValues("step1.firstname")} ${getValues("step1.lastname")}`
          );

          if (response.success) {
            toast({
              description: response.success,
            });
          } else {
            toast({ description: response.error, variant: "destructive" });
            return;
          }
        } catch (error) {
          console.log({ error });
          toast({ description: "An error occured!" });
          return;
        }
      }
      if (isValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // const isStepValid = await trigger(undefined, { shouldFocus: true });
      // if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted:", values);
  };
  return (
    <div>
      <div className="container mx-auto">
        <div className="space-y-2">
          <h4 className="text-2xl font-bold">Become a Vendor</h4>
          <h6 className="text-md">
            Please Fill the form to register your brand with us
          </h6>
        </div>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <StepperIndicator activeStep={activeStep} />
            </div>
            <div className="mt-8">
              {getStepContent(activeStep)}
              <div className="flex justify-end space-x-[20px] mt-10">
                <Button
                  type="button"
                  className="w-[100px]"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={activeStep === 1}
                >
                  Prev
                </Button>
                {activeStep === 3 ? (
                  <Button
                    className="w-[100px]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-[100px]"
                    disabled={isPending}
                    onClick={handleNext}
                  >
                    Next
                    {isPending && <Loader2 className="ml-2 animate-spin" />}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BecomeAVendor;
