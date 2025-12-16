import {
  facebookLink,
  instagramLogin2,
  getFacebookProfile,
} from "@/actions/instagram";
import categories from "@/data/categories";
import { cn } from "@/lib/utils";
import { BecomeAVendorSchemaType } from "@/schemas/become-a-vendor";
import { City, State } from "country-state-city";
import React, { useEffect, useTransition, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MultiSelect } from "./ui/multi-select";
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
  { value: "twitter", label: "Twitter", disabled: false },
];

const BuisnessDetailsForm = () => {
  const {
    register,
    getValues,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BecomeAVendorSchemaType>();
  const [isPending, startTransition] = useTransition();
  const [facebookProfile, setFacebookProfile] = useState<{
    username: string | null;
    userId: string | null;
  } | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step2.socialPlatform",
  });

  // Fetch Facebook profile on mount
  useEffect(() => {
    const fetchFacebookProfile = async () => {
      const result = await getFacebookProfile();
      if (result && "success" in result && result.success) {
        setFacebookProfile({
          username: result.username,
          userId: result.userId,
        });
        // Update form with Facebook username if available
        if (result.username) {
          const currentSocialPlatforms =
            getValues("step2.socialPlatform") || [];
          const facebookIndex = currentSocialPlatforms.findIndex(
            (p) => p.platform === "facebook"
          );
          if (facebookIndex === -1) {
            setValue("step2.socialPlatform", [
              ...currentSocialPlatforms,
              { platform: "facebook", username: result.username },
            ]);
          }
        }
      }
    };
    fetchFacebookProfile();
  }, []);

  const handleSelectCategories = (value: string[]) => {
    setValue("step2.categories", value);
  };

  const handleSocialLogin = (platform: string) => {
    startTransition(async () => {
      const values = getValues("step2");
      if (platform === "instagram") {
        await instagramLogin2(values);
      } else if (platform === "facebook") {
        await facebookLink(values);
        // Refresh Facebook profile after linking
        const result = await getFacebookProfile();
        if (result && "success" in result && result.success) {
          setFacebookProfile({
            username: result.username,
            userId: result.userId,
          });
        }
      }
    });
  };

  const DEVELOPMENT = false;

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2">
          <Label>Buisness Name</Label>
          <Input
            placeholder=""
            {...register("step2.businessName")}
            error={errors.step2?.businessName?.message}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>Whats your buisness about?</Label>
          <Input
            placeholder=""
            {...register("step2.businessAbout")}
            error={errors.step2?.businessAbout?.message}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="col-span-1 mb-2 sm:mb-0">
            <h4>Categories</h4>
          </div>
          <MultiSelect
            options={categories}
            value={watch("step2.categories")}
            defaultValue={getValues("step2.categories")}
            onValueChange={handleSelectCategories}
            className="col-span-1 sm:col-span-2 lg:col-span-3"
            maxCount={5}
          />
        </div>

        <div className="col-span-1">
          <Label>Country</Label>

          <Select
            value={watch("step2.address.country")}
            onValueChange={(value) => setValue("step2.address.country", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[{ label: "Nigeria", value: "NG" }].map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label>State</Label>

          <Select
            value={watch("step2.address.state")}
            onValueChange={(value) => setValue("step2.address.state", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {State.getStatesOfCountry(watch("step2.address.country")).map(
                (state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label>City</Label>

          <Select
            value={watch("step2.address.city")}
            onValueChange={(value) => setValue("step2.address.city", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {City.getCitiesOfState(
                watch("step2.address.country"),
                watch("step2.address.state")
              ).map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label>Street</Label>
          <Input
            placeholder=""
            {...register("step2.address.street")}
            error={errors.step2?.address?.street?.message}
          />
        </div>

        {fields.map((field, index) => (
          <React.Fragment key={index}>
            <div className="col-span-1">
              <Label>Select social platform</Label>

              <Select
                value={watch(`step2.socialPlatform.${index}.platform`)}
                onValueChange={(value) => {
                  setValue(`step2.socialPlatform.${index}.platform`, value);
                }}
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
                    <SelectItem
                      value={platform.value}
                      key={platform.value}
                      disabled={platform?.disabled}
                    >
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-full flex items-center gap-4">
              {DEVELOPMENT ? (
                <>
                  <Input
                    placeholder="Insert your username"
                    className="self-start md:mt-6"
                    {...register(`step2.socialPlatform.${index}.username`)}
                  />
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    className={cn(
                      "md:mt-[26px]",
                      watch(`step2.socialPlatform.${index}.username`) &&
                        "bg-destructive"
                    )}
                    disabled={
                      !watch(`step2.socialPlatform.${index}.platform`) ||
                      !!watch(`step2.socialPlatform.${index}.username`) ||
                      isPending
                    }
                    onClick={() =>
                      handleSocialLogin(
                        watch(`step2.socialPlatform.${index}.platform`)
                      )
                    }
                  >
                    {(() => {
                      const username = watch(
                        `step2.socialPlatform.${index}.username`
                      );
                      const platform = watch(
                        `step2.socialPlatform.${index}.platform`
                      );

                      // Show Facebook profile if platform is Facebook and profile exists
                      if (
                        platform === "facebook" &&
                        facebookProfile?.username &&
                        !username
                      ) {
                        return `Linked: ${facebookProfile.username}`;
                      }

                      // Default behavior
                      return username ? `Linked: ${username}` : "Link";
                    })()}
                  </Button>
                </>
              )}
              {index > 0 && (
                <Button
                  type="button"
                  variant={"destructive"}
                  className="self-start md:mt-[27px]"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </React.Fragment>
        ))}

        <div className="col-span-2">
          <Button
            type="button"
            onClick={() => append({ platform: "", username: "" })}
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
