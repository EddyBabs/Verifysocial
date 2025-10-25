"use client";
import { instagramLogin } from "@/actions/instagram";
import { updateSetting } from "@/actions/setting";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import React, { useState, useTransition } from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayRemove,
  useForm,
} from "react-hook-form";
import { z } from "zod";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
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
  const [isLinking, setIsLinking] = useState<string | null>(null);
  const form = useForm<z.infer<typeof settingFormSchema>>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      fullname: user.fullname,
      phone: user.phone || "",
      gender: user.gender?.toLowerCase() || "",
      socialPlatform: user.vendor?.socialAccount.map((account) => ({
        platform: account.provider.toLowerCase(),
        username: account.username || "",
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
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your account profile information and public details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="mt-4">
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
                        <SocialPlatformField
                          key={field.id}
                          field={field}
                          index={index}
                          form={form}
                          isPending={isPending}
                          isLinking={isLinking}
                          onRemove={remove}
                          fields={fields as any}
                          onInstagramLogin={instagramLogin}
                          setIsLinking={setIsLinking}
                        />
                      ))}
                    </>
                  )}
                  <div className="col-span-1 md:col-span-2">
                    <Button
                      type="button"
                      onClick={() => append({ platform: "", username: "" })}
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
      </CardContent>
    </Card>
  );
};

const SocialPlatformField = ({
  field,
  index,
  form,
  isPending,
  isLinking,
  onRemove,
  onInstagramLogin,
  setIsLinking,
  fields,
}: {
  field: any;
  index: number;
  form: any;
  isPending: boolean;
  isLinking: string | null;
  onRemove: UseFieldArrayRemove;
  onInstagramLogin: () => Promise<never>;
  setIsLinking: React.Dispatch<React.SetStateAction<string | null>>;
  fields: FieldArrayWithId<settingFormSchemaType>;
}) => {
  const platformValue = form.watch(`socialPlatform.${index}.platform`);
  const usernameValue = form.watch(`socialPlatform.${index}.username`);

  const handlePlatformChange = (value: string) => {
    form.setValue(`socialPlatform.${index}.platform`, value);
  };

  const handleLinkAccount = async () => {
    console.log("Clicked");

    try {
      if (usernameValue) return; // Already linked

      if (platformValue.toLowerCase() === "instagram") {
        console.log("Instagram");
        setIsLinking(platformValue.toLowerCase());
        await onInstagramLogin();
      }

      console.log({ platform: field.platform });
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLinking(null);
    }
  };

  const getButtonText = () => {
    return usernameValue ? `Linked: ${usernameValue}` : "Link";
  };

  const getButtonVariant = () => {
    return usernameValue ? "destructive" : "default";
  };

  const isButtonDisabled =
    usernameValue || isPending || isLinking === platformValue?.toLowerCase();

  return (
    <>
      <PlatformSelect
        index={index}
        value={platformValue}
        onValueChange={handlePlatformChange}
        fields={fields}
        currentField={field}
      />

      <UsernameSection
        index={index}
        usernameValue={usernameValue}
        isButtonDisabled={isButtonDisabled}
        buttonText={getButtonText()}
        buttonVariant={getButtonVariant()}
        onLinkAccount={handleLinkAccount}
        onRemove={onRemove}
        form={form}
      />
    </>
  );
};

const PlatformSelect = ({
  index,
  value,
  onValueChange,
  fields,
  currentField,
}: {
  index: number;
  value: string;
  onValueChange: (value: string) => void;
  fields: any;
  currentField: any;
}) => {
  const filteredPlatforms = PLATFORMS.filter((platform) => {
    const isAlreadySelected = fields.some(
      (field: any) => field.platform === platform.value
    );
    const isCurrentlySelected = currentField.platform === platform.value;
    return !isAlreadySelected || isCurrentlySelected;
  });

  return (
    <div className="col-span-1">
      <Label>Select social platform</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="py-5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filteredPlatforms.map((platform) => (
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
  );
};

const UsernameSection = ({
  index,
  usernameValue,
  isButtonDisabled,
  buttonText,
  buttonVariant,
  onLinkAccount,
  onRemove,
  form,
}: {
  index: number;
  usernameValue: string;
  isButtonDisabled: boolean;
  buttonText: string;
  buttonVariant: "destructive" | "default";
  onRemove: (index: number) => void;
  onLinkAccount: () => Promise<void>;
  form: any;
}) => {
  const DEVELOPMENT = false;
  const sectionClass = cn("h-full items-center w-full col-span-1 gap-4", {
    flex: !DEVELOPMENT,
  });

  if (DEVELOPMENT) {
    return (
      <div className={sectionClass}>
        <Input
          inputClassName=""
          className="self-start md:mt-[24px] w-full min-w-32 max-w-44 flex-1"
          placeholder="Insert profile name here"
          {...form.register(`socialPlatform.${index}.username`)}
        />
      </div>
    );
  }

  return (
    <div className={sectionClass}>
      <Button
        type="button"
        className={cn("md:mt-[26px]", usernameValue && "bg-destructive")}
        disabled={isButtonDisabled}
        onClick={onLinkAccount}
        variant={buttonVariant}
      >
        {buttonText}
      </Button>

      {index > 0 && (
        <Button
          type="button"
          variant="destructive"
          className="self-start md:mt-[27px]"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      )}
    </div>
  );
};

export default SettingForm;
