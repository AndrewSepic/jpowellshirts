import fs from 'fs/promises';
import path from 'path';

export async function renderOrderPlacedTemplate(vars: { customerName: string; orderId: string, items: any[] }) {
  const templatePath = path.join(process.cwd(), 'emails', 'order-placed.html');
  let html = await fs.readFile(templatePath, 'utf-8');
	
  console.log("items before email rendering", vars.items)
  const itemsHtml = vars.items.map(item =>
  `<li>${item.quantity} × ${item.name} (${item.size}, ${item.color})</li>`
).join('');

  html = html.replace(/{{customerName}}/g, vars.customerName);
  html = html.replace(/{{orderId}}/g, vars.orderId);
  return html;
}
