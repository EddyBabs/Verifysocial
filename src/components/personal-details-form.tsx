"use client";
import { becomeAVendorForm1 } from "@/schemas/become-a-vendor";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PersonalDetalsFormProps {
  user: User;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

type becomeAVendor1Type = z.infer<typeof becomeAVendorForm1>;

const PersonalDetalsForm: React.FC<PersonalDetalsFormProps> = ({
  user,
  setActiveStep,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<becomeAVendor1Type>({
    resolver: zodResolver(becomeAVendorForm1),
    defaultValues: {
      firstname: user.fullname.split(" ")[0],
      lastname:
        user.fullname.split(" ").length > 1 ? user.fullname.split(" ")[1] : "",
      phone: "",
      email: user.email,
    },
  });
  const handleNext = handleSubmit(
    () => {
      setActiveStep(2);
    },
    (errors) => {
      console.log("Validation error: ", errors);
    }
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-1">
          <Label>First Name</Label>
          <Input
            placeholder=""
            {...register("firstname")}
            error={errors.firstname?.message}
          />
        </div>

        <div className="col-span-1">
          <Label>Last Name</Label>
          <Input
            placeholder=""
            {...register("lastname")}
            error={errors.lastname?.message}
          />
        </div>

        <div className="col-span-2">
          <Label>Phone Number</Label>
          <Input
            placeholder=""
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        <div className="col-span-2">
          <Label>Email</Label>
          <Input
            placeholder=""
            {...register("email")}
            error={errors.email?.message}
            disabled={true}
          />
        </div>

        <div className="col-span-2">
          <Label>NIN Number</Label>
          <Input
            placeholder=""
            {...register("nin")}
            error={errors.nin?.message}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-[20px] mt-10">
        <Button
          type="button"
          className="w-[100px]"
          variant="secondary"
          disabled={true}
        >
          Prev
        </Button>

        <Button type="button" className="w-[100px]" onClick={handleNext}>
          Next
        </Button>
      </div>
    </>
  );
};

export default PersonalDetalsForm;
