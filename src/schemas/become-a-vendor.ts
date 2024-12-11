import * as z from "zod";

export const becomeAVendorForm1 = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(9, "Invalid phone number"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({
      message: "Gender must be either 'male' or 'female'",
    }),
  }),
  email: z.string().email(),
  nin: z.string().min(4, "Invalid Nin number"),
});

export const becomeAVendorForm2 = z.object({
  buisnessName: z.string().min(1, "Business name is required"),
  buisnessAbout: z.string().min(1, "What your business is about is required!"),
  socialPlatform: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required."),
      url: z.string().url("Enter a vaild URL"),
    })
  ),
});

export const becomeAVendorForm3 = z.object({
  otp: z.string().length(6),
});

export const becomeAVendorShcema = z.object({
  step1: becomeAVendorForm1,
  step2: becomeAVendorForm2,
  step3: becomeAVendorForm3,
});

export type BecomeAVendorSchemaType = z.infer<typeof becomeAVendorShcema>;
