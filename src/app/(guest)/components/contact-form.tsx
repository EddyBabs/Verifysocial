"use client";

import AmicoSvg from "@/assets/amico.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";

import { contactSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { error } from "console";
import { sendContactData } from "@/actions/contact";
import { toast } from "@/hooks/use-toast";

type contactType = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });
  const onSubmit = (values: contactType) => {
    startTransition(async () => {
      await sendContactData(values).then((res) => {
        if (res.success) {
          toast({ description: res.success });
          reset();
        } else {
          toast({ description: res.error, variant: "destructive" });
        }
      });
    });
  };
  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="flex flex-col gap-4 justify-center items-center">
          <h2 className="text-3xl font-semibold">Get in touch with us.</h2>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>

            <Input
              placeholder="Enter your name"
              id="name"
              {...register("name")}
              error={errors.name?.message}
              autoComplete="name"
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="xyzzz@gmail.com"
              id="email"
              {...register("email")}
              error={errors.email?.message}
              autoComplete="email"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your message</Label>
            <div className="relative">
              <Textarea
                placeholder="Type your message here."
                id="message"
                autoComplete="off"
                rows={5}
                {...register("message")}
              />
              {watch("message").length < 30 && (
                <span className="absolute bottom-1 right-2 text-muted-foreground">
                  {30 - watch("message").length}
                </span>
              )}
            </div>
            {errors.message?.message && (
              <span
                className="mt-2 block text-sm text-red-500"
                role="alert"
                aria-live="assertive"
              >
                {errors.message.message}
              </span>
            )}
          </div>
          <Button
            disabled={isPending}
            className="bg-gradient-to-r w-full from-[#003399] to-[#2C64D4]"
          >
            Send
          </Button>
        </div>
        <div>
          <div className="flex items-center w-full justify-center">
            <Image src={AmicoSvg} alt="" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
