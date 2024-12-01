"use client";
import BuisnessDetailsForm from "@/components/buisness-details-form";
import PersonalDetalsForm from "@/components/personal-details-form";
import StepperIndicator from "@/components/stepper-indicator";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Verification from "@/screens/verification";
import { User } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { Control, useForm } from "react-hook-form";

function getStepContent(
  step: number,
  control: Control<any>,
  setActiveStep: Dispatch<SetStateAction<number>>,
  user: User
) {
  switch (step) {
    case 1:
      return <PersonalDetalsForm user={user} setActiveStep={setActiveStep} />;
    case 2:
      return <BuisnessDetailsForm setActiveStep={setActiveStep} />;
    case 3:
      return <Verification control={control} />;
    default:
      return "Unknown step";
  }
}

interface BecomeAVendorProps {
  user: User;
}

const BecomeAVendor: React.FC<BecomeAVendorProps> = ({ user }) => {
  const [activeStep, setActiveStep] = useState(1);

  const methods = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      ninNumber: "",
      pin: "",
    },
    mode: "onTouched",
  });

  const {
    trigger,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    control,
  } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger(undefined, { shouldFocus: true });
    if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async () => {};
  return (
    <div>
      <div className="container">
        <div className="space-y-2">
          <h4 className="text-2xl font-bold">Become a Vendor</h4>
          <h6 className="text-md">
            Please Fill the form to register your brand with us
          </h6>
        </div>
        <div className="mb-4">
          <StepperIndicator activeStep={activeStep} />
        </div>
        <div className="mt-8">
          <Form {...methods}>
            <form>
              {getStepContent(activeStep, control, setActiveStep, user)}
              {/* <div className="flex justify-end space-x-[20px] mt-10">
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
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-[100px]"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </div> */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BecomeAVendor;
