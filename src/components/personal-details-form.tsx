"use client";
import { BecomeAVendorSchemaType } from "@/schemas/become-a-vendor";
import { CheckCheck } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const PersonalDetailsForm = () => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<BecomeAVendorSchemaType>();

  const ninNumber = getValues("step1.nin");
  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Label>First Name</Label>
          <Input
            placeholder=""
            {...register("step1.firstname")}
            error={errors.step1?.firstname?.message}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>Last Name</Label>
          <Input
            placeholder=""
            {...register("step1.lastname")}
            error={errors.step1?.lastname?.message}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>Phone Number</Label>
          <Input
            placeholder=""
            {...register("step1.phone")}
            error={errors.step1?.phone?.message}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>Gender</Label>
          <Select
            value={getValues("step1.gender")}
            onValueChange={(value) => setValue(`step1.gender`, value as any)}
          >
            <SelectTrigger className="py-5">
              <SelectValue placeholder="Gender" />{" "}
            </SelectTrigger>
            <SelectContent>
              {[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ].map((gender) => {
                return (
                  <SelectItem value={gender.value} key={gender.value}>
                    {gender.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.step1?.gender?.message && (
            <p className="text-destructive text-sm mt-1">
              {errors.step1.gender.message}
            </p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>Email</Label>
          <Input
            placeholder=""
            {...register("step1.email")}
            error={errors.step1?.email?.message}
            disabled={true}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>NIN Number</Label>
          {ninNumber == "verified" ? (
            <div className="border px-1 py-2 rounded-sm flex justify-between hover:cursor-not-allowed">
              Verified <CheckCheck className="text-green-500" />
            </div>
          ) : (
            <Input
              placeholder=""
              {...register("step1.nin")}
              error={errors.step1?.nin?.message}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalDetailsForm;
