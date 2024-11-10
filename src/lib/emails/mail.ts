import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { resetPasswordTemplate } from "./templates/reset-password";
import { verifyEmailTemplate } from "./templates/verify-email";
// import { welcomeTemplate } from "./templates/welcome";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  try {
    await transport.verify();
  } catch (error) {
    console.log({ error });
    return;
  }

  try {
    await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.log(error);
  }
}

export function compileVerifyEmailTemplate(name: string, confirmLink: string) {
  const template = handlebars.compile(verifyEmailTemplate);
  const htmlBody = template({
    name,
    confirmLink,
  });
  return htmlBody;
}

export function compileForgotPasswordTemplate(name: string, resetLink: string) {
  const template = handlebars.compile(resetPasswordTemplate);
  const htmlBody = template({
    resetLink,
  });

  return htmlBody;
}
