import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import { resetPasswordTemplate } from "./templates/reset-password";
import { verifyEmailTemplate } from "./templates/verify-email";
import { buisnessVerificationTemplate } from "./templates/buisness-verification";
import { RequestReceivedTemplate } from "./templates/request-received";
import { vendorRequestReceived } from "./templates/vendor-request-received";
import { OrderDeliveryConfirmation } from "./templates/order-delivery-confirmation";
import { requestCancelledTemplate } from "./templates/request-cancel";
import { vendorRequestCancelledTemplate } from "./templates/vendor-request-canceled";
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
      from: `Verify Social <${SMTP_EMAIL}>`,
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

export function compileBuisnessVerificationTemplate(
  name: string,
  token: string
) {
  const template = handlebars.compile(buisnessVerificationTemplate);
  const htmlBody = template({
    name,
    token,
  });
  return htmlBody;
}

export function compileRequestReceived(
  name: string,
  requestName: string,
  requestLink: string
) {
  const template = handlebars.compile(RequestReceivedTemplate);
  const htmlBody = template({
    name,
    requestName,
    requestLink,
  });
  return htmlBody;
}

export function compileVendorRequestReceived(
  name: string,
  requestName: string
) {
  const template = handlebars.compile(vendorRequestReceived);
  const htmlBody = template({
    name,
    requestName,
  });
  return htmlBody;
}

export function compileRequestCancelled(
  name: string,
  requestName: string,
  reason: string
) {
  const template = handlebars.compile(requestCancelledTemplate);
  const htmlBody = template({
    name,
    requestName,
    reason,
  });
  return htmlBody;
}

export function compileVendorRequestCancelled(
  name: string,
  orderLink: string,
  reason: string
) {
  const template = handlebars.compile(vendorRequestCancelledTemplate);
  const htmlBody = template({
    name,
    reason,
    orderLink,
  });
  return htmlBody;
}

export function compileOrderDeliveryConfirmation(
  name: string,
  verifyOrderLink: string
) {
  const template = handlebars.compile(OrderDeliveryConfirmation);
  const htmlBody = template({
    name,
    verifyOrderLink,
  });
  return htmlBody;
}
