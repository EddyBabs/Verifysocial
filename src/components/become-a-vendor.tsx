"use client";
import {
  addBuisness,
  sendBusinessVerification,
  verifyNIN,
} from "@/actions/buisness";
import BuisnessDetailsForm from "@/components/buisness-details-form";
import PersonalDetailsForm from "@/components/personal-details-form";
import StepperIndicator from "@/components/stepper-indicator";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  BecomeAVendorSchemaType,
  becomeAVendorShcema,
} from "@/schemas/become-a-vendor";
import Verification from "@/screens/verification";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
  user: Prisma.UserGetPayload<{
    select: {
      fullname: true;
      email: true;
      role: true;
      phone: true;
      gender: true;
      address: {
        select: {
          country: true;
          state: true;
          city: true;
          street: true;
        };
      };
      vendor: {
        select: {
          businessName: true;
          businessAbout: true;
          categories: true;
          socialAccount: true;
        };
      };
    };
  }>;
  ninVerified: boolean;
}

const BecomeAVendor: React.FC<BecomeAVendorProps> = ({ user, ninVerified }) => {
  const step1Completed =
    user.fullname && user.email && user.phone && user.gender && ninVerified;
  const [activeStep, setActiveStep] = useState(step1Completed ? 2 : 1);
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const methods = useForm<BecomeAVendorSchemaType>({
    resolver: zodResolver(becomeAVendorShcema),
    defaultValues: {
      step1: {
        firstname: user.fullname.split(" ")[0],
        lastname:
          user.fullname.split(" ").length > 1
            ? user.fullname.split(" ")[1]
            : "",
        email: user.email,
        phone: user.phone || "",
        gender:
          (user.gender?.toLowerCase() as "male" | "female" | undefined) ||
          undefined,
        nin: ninVerified ? "verified" : "",
      },
      step2: {
        businessName: user.vendor?.businessName || "",
        businessAbout: user.vendor?.businessAbout || "",
        socialPlatform: user.vendor?.socialAccount.length
          ? user.vendor?.socialAccount.map((account) => ({
              platform: account.provider.toLowerCase(),
              username: account.username || "",
            }))
          : [{ platform: "", username: "" }],
        address: {
          country: user.address?.country || "",
          state: user.address?.state || "",
          city: user.address?.city || "",
          street: user.address?.street || "",
        },
        categories: user?.vendor?.categories || [],
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
      const currentStepKey =
        `step${activeStep}` as keyof BecomeAVendorSchemaType;
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
          sessionStorage.removeItem("STEP2");
          const response = await sendBusinessVerification(
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

  const onSubmit = async (values: BecomeAVendorSchemaType) => {
    await addBuisness(values).then((response) => {
      if (response.success) {
        toast({ description: response.success });
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
        };

        const randomInRange = (min: number, max: number) =>
          Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            router.refresh();
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);
      } else {
        toast({ variant: "destructive", description: response.error });
      }
    });
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
