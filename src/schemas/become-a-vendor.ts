import * as z from "zod";

export const becomeAVendorForm1 = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(9, "Invalid phone number"),
  gender: z.enum(["male", "female"], {
    message: "Gender must be either 'male' or 'female'",
  }),
  email: z.string().email(),
  nin: z.string().min(4, "Invalid Nin number"),
});

export const becomeAVendorForm2 = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessAbout: z.string().min(1, "What your business is about is required!"),
  socialPlatform: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required."),
      username: z.string().min(1, "Username is required"),
    })
  ),
  categories: z.array(z.string()),
  address: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required!"),
    city: z.string().min(1, "City is required"),
    street: z.string().min(1, "Street is required"),
  }),
});

export const becomeAVendorForm3 = z.object({
  otp: z.string().length(6),
});

export const becomeAVendorShcema = z.object({
  step1: becomeAVendorForm1,
  step2: becomeAVendorForm2,
  step3: becomeAVendorForm3,
});

export const businessDetails = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessAbout: z.string().min(1, "What your business is about is required!"),
  categories: z.array(z.string()),
  address: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required!"),
    city: z.string().min(1, "City is required"),
    street: z.string().min(1, "Street is required"),
  }),
});

export type BecomeAVendorSchemaType = z.infer<typeof becomeAVendorShcema>;
