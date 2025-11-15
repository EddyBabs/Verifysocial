"use server";
import { compileContactMessage, sendMail } from "@/lib/emails/mail";
import { contactSchema } from "@/schemas/auth";
import * as z from "zod";

export const sendContactData = async (
  values: z.infer<typeof contactSchema>
) => {
  try {
    const validatedFields = contactSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }
    const { email, message, name } = validatedFields.data;
    await sendMail({
      to: "info@verifysocial.com.ng",
      subject: "New Contact Message",
      body: compileContactMessage(email, message, name),
    });
    return { success: "Contact Message has been sent" };
  } catch (error) {
    console.log({ error });
    return { error: "Unable to send message. Try again later!" };
  }
};
