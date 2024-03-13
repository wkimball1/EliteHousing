import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import {
  // upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord,
  upsertCustomer,
  upsertJobFromStripe,
  upsertSale,
} from "@/utils/supabase/admin";

const relevantEvents = new Set([
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "invoice.updated",
  "invoice.paid",
  "invoice.finalized",
  "invoice.voided",
  // "product.created",
  // "product.updated",
  // "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.succeeded",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await upsertSale(event.data.object as Stripe.PaymentIntent);
          break;
        case "customer.created":
        case "customer.updated":
          await upsertCustomer(event.data.object as Stripe.Customer);
          break;
        case "invoice.updated":
        case "invoice.finalized":
        case "invoice.voided":
        case "invoice.paid":
          await upsertJobFromStripe(event.data.object as Stripe.Invoice);
          break;
        // case "product.created":
        // case "product.updated":
        //   await upsertProductRecord(event.data.object as Stripe.Product);
        //   break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "price.deleted":
          await deletePriceRecord(event.data.object as Stripe.Price);
          break;
        // case "product.deleted":
        //   await deleteProductRecord(event.data.object as Stripe.Product);
        //   break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ received: true }));
}
