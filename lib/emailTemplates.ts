import fs from 'fs/promises';
import path from 'path';

export async function renderOrderPlacedTemplate(vars: { customerName: string; orderId: string, items: any[] }) {
  const templatePath = path.join(process.cwd(), 'emails', 'order-placed.html');
  let html = await fs.readFile(templatePath, 'utf-8');
  
  const itemsHtml = vars.items.map(item => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px; border: 1px solid #eee; border-radius: 6px; overflow: hidden;">
      <tr>
        <td width="100" style="padding: 12px; vertical-align: top;">
          <img src="${item.imageUrl}" alt="${item.productTitle}" width="80" height="80" style="object-fit: cover; border-radius: 4px; display: block;" />
        </td>
        <td style="padding: 12px; vertical-align: top;">
          <div style="font-weight: bold; font-size: 1em; margin-bottom: 4px;">${item.productTitle}</div>
          <div style="color: #555; font-size: 0.9em;">Color: ${item.color}</div>
          <div style="color: #555; font-size: 0.9em;">Size: ${item.size}</div>
          <div style="color: #555; font-size: 0.9em;">Qty: ${item.quantity}</div>
          <div style="font-weight: bold; margin-top: 6px;">$${Number(item.price).toFixed(2)}</div>
        </td>
      </tr>
    </table>
  `).join('');

  html = html.replace(/{{customerName}}/g, vars.customerName);
  html = html.replace(/{{orderId}}/g, vars.orderId);
  html = html.replace(/{{itemsHTML}}/g, itemsHtml);
  return html;
}
