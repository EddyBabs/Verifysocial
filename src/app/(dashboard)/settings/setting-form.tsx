"use client";
import { facebookLogin, instagramLogin } from "@/actions/instagram";
import { updateSetting } from "@/actions/setting";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import categories from "@/data/categories";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { settingFormSchema, settingFormSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const PLATFORMS = [
  { value: "facebook", label: "Facebook & Instagram" },
  { value: "twitter", label: "Twitter", disabled: true },
];

interface SettingFormProps {
  user: Prisma.UserGetPayload<{
    select: {
      fullname: true;
      phone: true;
      gender: true;
      role: true;
      vendor: {
        select: {
          categories: true;
          socialAccount: true;
        };
      };
      address: { select: { country: true } };
    };
  }>;
}

const SettingForm: React.FC<SettingFormProps> = ({ user }) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof settingFormSchema>>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      fullname: user.fullname,
      phone: user.phone || "",
      gender: user.gender?.toLowerCase() || "",
      socialPlatform: user.vendor?.socialAccount.map((account) => ({
        platform: account.provider.toLowerCase(),
        token: account.accessToken,
      })),
      categories: user.vendor?.categories || [],
    },
  });
  const handleSelectCategories = (value: string[]) => {
    form.setValue("categories", value);
  };

  const onSubmit = async (values: settingFormSchemaType) => {
    const response = await updateSetting(values);
    if (response.success) {
      toast({ description: response.success });
    } else {
      toast({ description: response.error, variant: "destructive" });
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialPlatform",
  });

  const handleMeta = () => {
    startTransition(async () => {
      instagramLogin();
    });
  };

  const handleSocialLogin = (platform: string) => {
    if (platform === "facebook") {
      handleMeta();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div>
            <h4 className="font-semibold text-lg">Your Profile</h4>
            <h6>Please update your profile settings here</h6>
          </div>
          <div className="mt-12">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="">
                <Label>Full Name</Label>
                <Input
                  placeholder=""
                  {...form.register("fullname")}
                  error={form.formState.errors.fullname?.message}
                />
              </div>

              <div className="">
                <Label>Phone</Label>
                <Input
                  placeholder=""
                  {...form.register("phone")}
                  error={form.formState.errors.phone?.message}
                />
              </div>

              <div>
                <Label>Gender</Label>
                <Select
                  value={form.watch(`gender`)}
                  onValueChange={(value) => form.setValue(`gender`, value)}
                >
                  <SelectTrigger className="py-5">
                    <SelectValue placeholder="Gender" />{" "}
                  </SelectTrigger>
                  <SelectContent>
                    {["Male", "Female"].map((gender) => (
                      <SelectItem value={gender.toLowerCase()} key={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {user.role === "VENDOR" && (
                <>
                  <div className="">
                    <div className="col-span-1 mb-2 sm:mb-0">
                      <h4>Categories</h4>
                    </div>
                    <MultiSelect
                      options={categories}
                      value={form.watch("categories")}
                      defaultValue={form.getValues("categories")}
                      onValueChange={handleSelectCategories}
                      className="col-span-1 sm:col-span-2 lg:col-span-3"
                      maxCount={5}
                    />
                  </div>

                  {fields.map((field, index) => (
                    <>
                      <div className="col-span-1">
                        <Label>Select social platform</Label>

                        <Select
                          value={form.watch(`socialPlatform.${index}.platform`)}
                          onValueChange={(value) =>
                            form.setValue(
                              `socialPlatform.${index}.platform`,
                              value
                            )
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
                        {/* <Label>Token</Label> */}
                        {/* <div className="col-span-1 flex items-center w-full gap-2">
                          <Input
                            placeholder=""
                            inputClassName="w-full flex-1"
                            {...form.register(`socialPlatform.${index}.token`)}
                            error={
                              form.formState.errors?.socialPlatform?.[index]
                                ?.token?.message
                            }
                          /> */}
                        <Button
                          type="button"
                          className={cn(
                            "md:mt-[26px]",
                            form.watch(`socialPlatform.${index}.token`) &&
                              "bg-destructive"
                          )}
                          disabled={
                            !!form.watch(`socialPlatform.${index}.token`) ||
                            isPending
                          }
                        >
                          {form.watch(`socialPlatform.${index}.token`)
                            ? "Linked"
                            : "Link"}
                        </Button>
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
                    </>
                  ))}
                </>
              )}
              <div className="col-span-1 md:col-span-2">
                <Button
                  type="button"
                  onClick={() => append({ platform: "", token: "" })}
                  disabled={fields.length >= PLATFORMS.length}
                >
                  Add New Social Profile
                </Button>
              </div>
            </div>
          </div>
          <div className="text-right mt-8">
            <Button disabled={form.formState.isSubmitting}>
              Update{" "}
              {form.formState.isSubmitting && (
                <Loader2 className="ml-2 animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SettingForm;
