import sgMail from '@sendgrid/mail';
import { renderOrderPlacedTemplate } from './emailTemplates';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface SendOrderEmailParams {
  to: string;
  orderId: string;
  customerName: string;
}

export async function sendOrderPlacedEmail({ to, orderId, customerName }: SendOrderEmailParams) {
  const html = await renderOrderPlacedTemplate({ customerName, orderId });
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Your order ${orderId} has been placed!`,
    text: `Hi ${customerName},\n\nThank you for your order! We'll notify you when it ships.`,
    html,
  };
  await sgMail.send(msg);
}
