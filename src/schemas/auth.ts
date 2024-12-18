import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    "Password must contain at least one number, one uppercase, and one lowercase letter"
  );

export const emailSchema = z
  .string()
  .email()
  .min(1)
  .transform((email) => email.toLowerCase());

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
  });

export const fullNameSchema = z
  .string()
  .min(1, "Full Name is a required field");

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const signUpSchema = z.object({
  fullname: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  terms: z.boolean().refine((value) => value === true, {
    message: "Accept terms and conditions",
  }),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is a required field"),
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export const VerifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, {
    message: "Token must be exactly 6 digits",
  }),
});

export const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  code: z.string(),
  value: z.number().min(1),
  date: z.date(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent is needed to track product",
  }),
});
