import { platform } from "os";
import * as z from "zod";

export const rateOrderShema = z.object({
  orderId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

export const createOrderShema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity cannot be less than 1"),
  amount: z.object({
    min: z.number().min(1000, "Amount cannot be less than 1000"),
    max: z.number().min(1000, "Amount cannot be less than 1000"),
  }),
  deliveryPeriod: z.date(),
  returnPeriod: z.number().min(1, "Return period cannot be less than 1"),
});

export type createOrderShemaType = z.infer<typeof createOrderShema>;

export const settingFormSchema = z.object({
  fullname: z.string(),
  phone: z.string(),
  gender: z.string(),
  socialPlatform: z.array(
    z.object({
      platform: z.string(),
      token: z.string(),
    })
  ),

  categories: z.array(z.string()),
});

export type settingFormSchemaType = z.infer<typeof settingFormSchema>;

// export type
