import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId } = req.body ?? {};

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const origin =
      (req.headers.origin as string) ||
      (process.env.APP_URL as string) ||
      "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?success=1`,
      cancel_url: `${origin}/?canceled=1`,
      // Optional but useful:
      // client_reference_id: "some-user-id"
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
