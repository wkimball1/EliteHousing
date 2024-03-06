"use server";

import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@/utils/supabase/server";
import { createOrRetrieveCustomer } from "@/utils/supabase/admin";
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp,
} from "@/utils/helpers";
import { Tables } from "@/types_db";

type Price = Tables<"prices">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = "/account"
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    );
    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      };
    } else if (price.type === "one_time") {
      params = {
        ...params,
        mode: "payment",
      };
    }

    // Create a checkout session in Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          "Please try again later or contact a system administrator."
        ),
      };
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator."
        ),
      };
    }
  }
}
export async function retrieveCustomer({
  // customerId,
  id,
}: {
  // customerID: string;
  id: string;
}) {
  const existingStripeCustomer = await stripe.customers.retrieve(id);

  if (!!existingStripeCustomer) {
    return JSON.parse(JSON.stringify(existingStripeCustomer));
  }
  return { error: "customer not found" };
}

export async function retrieveCustomerInvoices({
  // customerId,
  id,
}: {
  // customerID: string;
  id: string;
}) {
  const { data: stripeCustomerInvoices } = await stripe.invoices.list({
    customer: id,
  });

  if (!!stripeCustomerInvoices) {
    return JSON.parse(JSON.stringify(stripeCustomerInvoices));
  }
  return { error: "invoices not found" };
}
export async function createCustomerInvoice(customer: any) {
  const updatedCustomer = {
    ...customer,
    collection_method: "send_invoice",
    auto_advance: true,
    days_until_due: 30,
  };

  const invoice = await stripe.invoices.create(updatedCustomer);
  console.log(invoice);
  if (!!invoice) {
    return invoice.id;
  }
  return "";
}
export async function createCustomerLineItem(
  invoiceId: any,
  tableData: any[],
  supabaseCustomer: any
) {
  const lineItems = tableData.map(async (item) => {
    const lineItem = {
      customer: supabaseCustomer.id,
      price: item.price_id,
      quantity: item.quantity,
      invoice: invoiceId,
    };
    const invoiceItem = await stripe.invoiceItems.create(lineItem);
  });
  console.log(lineItems);
  if (!!lineItems) {
    return JSON.parse(JSON.stringify(lineItems));
  }
  return { error: "invoice item not created" };
}

export async function createStripePortal(
  currentPath: string,
  customerId: string | null
) {
  try {
    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer: customerId!,
        return_url: getURL(currentPath),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        "Please try again later or contact a system administrator."
      );
    } else {
      return getErrorRedirect(
        currentPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator."
      );
    }
  }
}
