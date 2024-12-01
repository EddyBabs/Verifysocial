import React, { Dispatch, SetStateAction } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { becomeAVendorForm2 } from "@/schemas/become-a-vendor";
import * as z from "zod";

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
];

type BecomeAVendorForm2Type = z.infer<typeof becomeAVendorForm2>;

interface BuisnessDetailsFormProps {
  setActiveStep: Dispatch<SetStateAction<number>>;
}

const BuisnessDetailsForm: React.FC<BuisnessDetailsFormProps> = ({
  setActiveStep,
}) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<BecomeAVendorForm2Type>({
    resolver: zodResolver(becomeAVendorForm2),
    defaultValues: {
      buisnessName: "",
      buisnessAbout: "",
      socialPlatform: [{ platform: "", url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialPlatform",
  });

  const handleBack = () => {
    setActiveStep(1);
  };

  const handleNext = handleSubmit(
    () => {
      setActiveStep(3);
    },
    (errors) => {
      console.log({ errors });
    }
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2">
          <Label>Buisness Name</Label>
          <Input
            placeholder=""
            {...register("buisnessName")}
            error={errors.buisnessName?.message}
          />
        </div>

        <div className="col-span-2">
          <Label>Whats your buisness about?</Label>
          <Input
            placeholder=""
            {...register("buisnessAbout")}
            error={errors.buisnessAbout?.message}
          />
        </div>

        {fields.map((field, index) => (
          <>
            <div className="col-span-1">
              <Label>Select social platform</Label>
              {/* <Input placeholder="" /> */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="platform" />{" "}
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem value={platform.value} key={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>URL</Label>
              <div className="col-span-1 flex items-center w-full gap-2">
                <Input
                  placeholder=""
                  inputClassName="w-full flex-1"
                  error={errors?.socialPlatform?.[index]?.url?.message}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </>
        ))}

        <div className="col-span-2">
          <Button
            type="button"
            onClick={() => append({ platform: "", url: "" })}
            disabled={fields.length >= PLATFORMS.length}
          >
            Add New Social Profile
          </Button>
        </div>
      </div>
      <div className="flex justify-end space-x-[20px] mt-10">
        <Button
          type="button"
          className="w-[100px]"
          variant="secondary"
          onClick={handleBack}
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

export default BuisnessDetailsForm;
