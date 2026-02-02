import fs from 'fs/promises';
import path from 'path';

export async function renderOrderPlacedTemplate(vars: { customerName: string; orderId: string }) {
  const templatePath = path.join(process.cwd(), 'emails', 'order-placed.html');
  let html = await fs.readFile(templatePath, 'utf-8');
  html = html.replace(/{{customerName}}/g, vars.customerName);
  html = html.replace(/{{orderId}}/g, vars.orderId);
  return html;
}
