import * as z from "zod";

export const becomeAVendorForm1 = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(9, "Invalid phone number"),
  email: z.string().email(),
  nin: z.string().min(4, "Invalid Nin number"),
});

export const becomeAVendorForm2 = z.object({
  buisnessName: z.string(),
  buisnessAbout: z.string(),
  socialPlatform: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required."),
      url: z.string().url("Enter a vaild URL"),
    })
  ),
});
