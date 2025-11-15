import * as handlebars from "handlebars";
import nodemailer from "nodemailer";
import { buisnessVerificationTemplate } from "./templates/buisness-verification";
import { CustomerCancellationCustomerTemplate } from "./templates/customer-cancellation-customer";
import { CustomerCancellationVendorTemplate } from "./templates/customer-cancellation-vendor";
import { CustomerExtensionCustomerTemplate } from "./templates/customer-extension-customer";
import { CustomerExtensionVendorTemplate } from "./templates/customer-extension-vendor";
import { orderDelayFlagged } from "./templates/order-delay-flagged";
import { OrderDeliveryConfirmation } from "./templates/order-delivery-confirmation";
import { requestCancelledTemplate } from "./templates/request-cancel";
import { RequestReceivedTemplate } from "./templates/request-received";
import { resetPasswordTemplate } from "./templates/reset-password";
import { VendorCancellationCustomerTemplate } from "./templates/vendor-cancellation-customer";
import { VendorCancellationVendorTemplate } from "./templates/vendor-cancellation-vendor";
import { VendorExtensionCustomerTemplate } from "./templates/vendor-extension-customer";
import { VendorExtensionVendorTemplate } from "./templates/vendor-extension-vendor";
import { VendorOrderDeliveryConfirmation } from "./templates/vendor-order-delivery-confirmation";
import { VendorPaymentReversalCustomerTemplate } from "./templates/vendor-payment-reversal-customer";
import { vendorRequestCancelledTemplate } from "./templates/vendor-request-canceled";
import { vendorRequestReceived } from "./templates/vendor-request-received";
import { verifyEmailTemplate } from "./templates/verify-email";
import { SatisfactionEmailTemplate } from "./templates/satisfaction";
import { VendorConfirmationUserEmail } from "./templates/vendor-confirmation-user-email";
import { contactMessageTemplate } from "./templates/contact-message";
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

export function compileVendorOrderDeliveryConfirmation(
  name: string,
  orderNumber: string,
  orderLink: string
) {
  const template = handlebars.compile(VendorOrderDeliveryConfirmation);
  const htmlBody = template({
    name,
    orderNumber,
    verifyOrderLink: orderLink,
  });
  return htmlBody;
}

export function compileOrderDelayFlagged(name: string, code: string) {
  const template = handlebars.compile(orderDelayFlagged);
  const htmlBody = template({
    name,
    code,
  });
  return htmlBody;
}

export function compileVendorOrderDelayFlagged(
  name: string,
  code: string,
  verifyOrderLink: string
) {
  const template = handlebars.compile(compileVendorOrderDelayFlagged);
  const htmlBody = template({
    name,
    code,
    verifyOrderLink,
  });
  return htmlBody;
}

// Customer
export function compileCustomerExtensionCustomer(
  name: string,
  extendedDate: string
) {
  const template = handlebars.compile(CustomerExtensionCustomerTemplate);
  const htmlBody = template({
    name,
    extendedDate,
  });
  return htmlBody;
}

export function compileCustomerExtensionVendor(
  vendorName: string,
  customerName: string,
  extendedReason: string
) {
  const template = handlebars.compile(CustomerExtensionVendorTemplate);
  const htmlBody = template({
    vendorName,
    customerName,
    extendedReason,
  });
  return htmlBody;
}

export function compileVendorExtensionCustomer(
  name: string,
  orderNumber: string,
  vendorName: string,
  extendedReason: string,
  extendedDate: string
) {
  const template = handlebars.compile(VendorExtensionCustomerTemplate);
  const htmlBody = template({
    name,
    orderNumber,
    vendorName,
    extendedReason,
    extendedDate,
  });
  return htmlBody;
}

export function compileVendorExtensionVendor(name: string) {
  const template = handlebars.compile(VendorExtensionVendorTemplate);
  const htmlBody = template({
    name,
  });
  return htmlBody;
}

export function compileVendorCancellationCustomer(
  name: string,
  code: string,
  vendorContactLink: string
) {
  const template = handlebars.compile(VendorCancellationCustomerTemplate);
  const htmlBody = template({
    name,
    code,
    vendorContactLink,
  });
  return htmlBody;
}

export function compileVendorCancellationVendor(name: string, code: string) {
  const template = handlebars.compile(VendorCancellationVendorTemplate);
  const htmlBody = template({
    name,
    code,
  });
  return htmlBody;
}

export function compileCustomerCancellationVendor(
  name: string,
  reason: string,
  code: string,
  confirmationRecallLink: string
) {
  const template = handlebars.compile(CustomerCancellationVendorTemplate);
  const htmlBody = template({
    name,
    code,
    reason,
    confirmationRecallLink,
  });
  return htmlBody;
}

export function compileCustomerCancellationCustomer(
  name: string,
  code: string
) {
  const template = handlebars.compile(CustomerCancellationCustomerTemplate);
  const htmlBody = template({
    name,
    code,
  });
  return htmlBody;
}

export function compileVendorPaymentReversalCustomer(
  name: string,
  code: string
) {
  const template = handlebars.compile(VendorPaymentReversalCustomerTemplate);
  const htmlBody = template({
    name,
    code,
  });
  return htmlBody;
}

export function compileContactMessage(
  email: string,
  message: string,
  name: string
) {
  const template = handlebars.compile(contactMessageTemplate);
  const htmlBody = template({
    name,
    email,
    message,
  });
  return htmlBody;
}

export function compileSatisfactionEmail(name: string, surveyLink: string) {
  const template = handlebars.compile(SatisfactionEmailTemplate);
  const htmlBody = template({
    name,
    surveyLink,
  });
  return htmlBody;
}

export function compileVendorConfirmationEmail(
  name: string,
  orderId: string,
  orderLink: string
) {
  const template = handlebars.compile(VendorConfirmationUserEmail);
  const htmlBody = template({
    name,
    orderId,
    orderLink,
  });
  return htmlBody;
}
