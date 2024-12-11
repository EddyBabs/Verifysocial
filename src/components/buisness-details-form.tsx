import { useFieldArray, useFormContext } from "react-hook-form";

import { BecomeAVendorSchemaType } from "@/schemas/become-a-vendor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
];

const BuisnessDetailsForm = () => {
  const {
    register,
    getValues,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<BecomeAVendorSchemaType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step2.socialPlatform",
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2">
          <Label>Buisness Name</Label>
          <Input
            placeholder=""
            {...register("step2.buisnessName")}
            error={errors.step2?.buisnessName?.message}
          />
        </div>

        <div className="col-span-2">
          <Label>Whats your buisness about?</Label>
          <Input
            placeholder=""
            {...register("step2.buisnessAbout")}
            error={errors.step2?.buisnessAbout?.message}
          />
        </div>

        {fields.map((field, index) => (
          <>
            <div className="col-span-1">
              <Label>Select social platform</Label>

              <Select
                value={getValues(`step2.socialPlatform.${index}.platform`)}
                onValueChange={(value) =>
                  setValue(`step2.socialPlatform.${index}.platform`, value)
                }
              >
                <SelectTrigger className="py-5">
                  <SelectValue placeholder="platform" />{" "}
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.filter((platform) => {
                    // Ensure the platform is not in the fields array or matches the currently selected value
                    const isAlreadySelected = fields.some(
                      (field) => field.platform === platform.value
                    );
                    const isCurrentlySelected =
                      field.platform === platform.value; // Replace 'selectedPlatform' with your actual state or logic for the current selection
                    return !isAlreadySelected || isCurrentlySelected;
                  }).map((platform) => (
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
                  {...register(`step2.socialPlatform.${index}.url`)}
                  error={errors.step2?.socialPlatform?.[index]?.url?.message}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant={"destructive"}
                    className="self-start"
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
    </>
  );
};

export default BuisnessDetailsForm;
