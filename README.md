# JPowell Shirts

A headless e-commerce storefront built on print-on-demand and payment APIs — browse products, pay via       
Stripe, and a real order is automatically submitted to Printify for fulfillment via webhook. No traditional backend, no inventory management — connect to your API storefront and ship real products.

## What it does

- Browse a product gallery pulled live from Printify's print-on-demand API
- View product detail pages with color/size variant selection
- Add items to a persistent cart (`localStorage`) and proceed through checkout
- Pay via Stripe with payment intent creation and webhook-confirmed order fulfillment
- Receive a post-purchase confirmation email via Mailgun
- Address autocomplete powered by Mapbox Search

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Payments | Stripe (Payment Intents + Webhooks) |
| Print fulfillment | Printify API |
| Transient data store | Upstash Redis |
| Email | Mailgun |
| Address autocomplete | Mapbox Search JS |
| Analytics | Google Analytics 4 |
| Deployment | Vercel |

## Architecture notes

- **Server components throughout** — product data fetches happen on the server, keeping API tokens out of the browser
- **Streaming with Suspense** — product detail pages stream a shimmer skeleton immediately while the Printify API resolves in the background, eliminating the blank-page wait on first load
- **Redis for ephemeral order state** — order data is written to Upstash at checkout and read back after Stripe's webhook confirms payment, then deleted
- **Stripe webhook fulfillment** — orders are only submitted to Printify after Stripe confirms payment server-side, not on client redirect

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and populate all values.
