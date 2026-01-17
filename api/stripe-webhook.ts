import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

// IMPORTANT: Stripe needs the raw body to verify the signature.
// Vercel's default body parsing can break that, so we read the raw stream ourselves.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Missing Stripe signature");
  }

  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log what we got (so you can see it in Vercel logs)
  console.log("✅ Stripe webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // This is where we later "unlock export"
    console.log("Checkout completed for:", {
      customer: session.customer,
      customer_email: session.customer_details?.email,
      subscription: session.subscription,
    });
  }

  return res.status(200).json({ received: true });
}
