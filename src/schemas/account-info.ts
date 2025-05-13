import * as z from "zod";

export const accountFormSchema = z.object({
  accountNumber: z
    .string()
    .min(8, {
      message: "Account number must be at least 8 characters.",
    })
    .max(20, {
      message: "Account number must not be longer than 20 characters.",
    }),

  bank: z.object({
    slug: z.string(),
    code: z.string(),
    type: z.enum(["nuban"]),
    currency: z.enum(["NGN"]),
    name: z.string(),
  }),
  bankCode: z.string().min(1, { message: "Bank Code required" }),
  accountName: z.string().min(9, {
    message: "Account name is required",
  }),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
