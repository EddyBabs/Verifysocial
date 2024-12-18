import * as z from "zod";

export const rateOrderShema = z.object({
  orderId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});
