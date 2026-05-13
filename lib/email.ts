import FormData from 'form-data';
import { renderOrderPlacedTemplate } from './emailTemplates';
import Mailgun from 'mailgun.js';

export interface SendOrderEmailParams {
  to: string;
  orderId: string;
  customerName: string;
  items: any[];
}

export async function sendOrderPlacedEmail({ to, orderId, customerName, items }: SendOrderEmailParams) {
  const html = await renderOrderPlacedTemplate({ customerName, orderId, items });
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY || "API_KEY"
  })

  try {
    const data = await mg.messages.create("mg.jpowellshirts.com", {
		to,
		from: process.env.MAILGUN_FROM_EMAIL!,
		subject: `Your order ${orderId} has been placed!`,
		text: `Hi ${customerName},\n\nThank you for your order! We'll notify you when it ships.`,
		html,
  	});

    console.log('[MAILGUN] ✅ Order email sent to', to, '(id:', data.id + ')');
  } catch (error) {
    console.error('[MAILGUN] Order email error:', error);
  }
}
