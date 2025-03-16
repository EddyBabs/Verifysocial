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
      username: z.string(),
    })
  ),

  categories: z.array(z.string()),
});

export type settingFormSchemaType = z.infer<typeof settingFormSchema>;

export const orderConfirmationSchema = z
  .object({
    orderId: z.string().min(10, "Invalid order Id"),
    received: z.enum(["yes", "no"]).optional(),
    rating: z.number().min(0).max(5),
    comment: z.string(),
    deliveryExtension: z.date().optional(),
    vendorContact: z.string().optional(),
    orderExtend: z.string(),
    madePayment: z.string(),
    extensionReason: z.string().optional(),
    cancellationReason: z.string().optional(),
    otherReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.orderExtend === "yes" && !data.deliveryExtension) {
        return false;
      }
      return true;
    },
    {
      message: "New delivery date is required",
      path: ["deliveryExtension"],
    }
  );

export const vendorCustomerContactSchema = z.object({
  orderId: z.string().min(10, "Invalid order id"),
  resolved: z.boolean(),
  customerPayment: z.boolean(),
  customerContact: z.enum(["yes", "no"]),
});

export type vendorCustomerContactSchemaType = z.infer<
  typeof vendorCustomerContactSchema
>;

export type orderConfirmationSchemaType = z.infer<
  typeof orderConfirmationSchema
>;

export const orderCancelFormSchema = z
  .object({
    orderId: z.string().min(12, "Invalid order"),
    reason: z.string(),
    hasPaid: z.boolean(),
    cancellationConfirm: z.boolean(),
    otherReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.reason === "Other" && !data.otherReason) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide a reason",
      path: ["otherReason"], // This makes the error show under `otherReason`
    }
  );

export type orderCancelFormSchemaType = z.infer<typeof orderCancelFormSchema>;

export const orderDelaySchema = z
  .object({
    orderId: z.string().min(12, "Invalid order"),
    reason: z.string(),
    otherReason: z.string().optional(),
    deliveryExtension: z.date().optional(),
    extend: z.boolean(),
    hasPaid: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.reason === "Other" && !data.otherReason) {
        return false;
      }
      return true;
    },
    {
      message: "Please provide a reason",
      path: ["otherReason"], // This makes the error show under `otherReason`
    }
  );

export type orderDelayFormSchemaType = z.infer<typeof orderDelaySchema>;

export const satisfactionSchema = z.object({
  orderId: z.string().min(1, "Order Id is required"),
  transactionSatisfaction: z.number().min(1).max(5),
  rateApp: z.number().min(1).max(5),
  returnToApp: z.number().min(1).max(5),
  feelSafe: z.number().min(1).max(5),
  recommend: z.number().min(1).max(5),
});

export type satisfactionSchemaType = z.infer<typeof satisfactionSchema>;
