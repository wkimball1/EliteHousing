import { toDateTime } from "@/utils/helpers";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type {
  Database,
  JobUpdate,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types_db";
import { Product } from "@/app/admin/dashboard/inventory/page";
import { ProductDelete } from "@/components/supabaseServer";

type Products = TablesInsert<"products">;

type Price = Tables<"prices">;
type Customer = Tables<"customers">;
type UpdateJob = JobUpdate;
type InsertJob = TablesInsert<"jobs">;
type Job = Tables<"jobs">;
type Sale = TablesInsert<"sales">;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// const upsertProductRecord = async (product: Stripe.Product) => {
//   const productData: Product = {
//     id: product.id,
//     active: product.active,
//     name: product.name,
//     description: product.description ?? null,
//     image: product.images?.[0] ?? null,
//     metadata: product.metadata,
//   };

//   const { error: upsertError } = await supabaseAdmin
//     .from("products")
//     .upsert([productData]);
//   if (upsertError)
//     throw new Error(`Product insert/update failed: ${upsertError.message}`);
//   console.log(`Product inserted/updated: ${product.id}`);
// };

const deletedProductRecord = async (product: ProductDelete) => {
  const { data: updatedProduct, error: productError } = await supabaseAdmin
    .from("products")
    .update({
      active: false,
    })
    .eq("id", product.id)
    .select();
  console.log(`Product set inactive: ${updatedProduct}`);
  if (productError) {
    throw new Error(`Error updating product: ${productError.message}`);
  }
  return updatedProduct;
};

const updateProductRecord = async (product: ProductDelete) => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .update(product)
    .eq("id", product.id)
    .select();
  console.log(`Product updated: ${data}`);
  if (error) {
    throw new Error(`Error updating product: ${error}`);
  }
  return data;
};

const upsertJobRecord = async (job: InsertJob) => {
  const jobData: InsertJob = {
    invoice_id: job.invoice_id,
    is_paid: false,
    is_work_done: false,
    work_completed_date: null,
    products: job.products,
    customer: job.customer,
    employee: job.employee,
    job_status: "pending",
    invoice_status: "draft",
    address: job.address,
  };

  const { data: jobs, error: upsertError } = await supabaseAdmin
    .from("jobs")
    .upsert(jobData);
  if (upsertError) {
    throw new Error(`Job insert/update failed: ${upsertError.message}`);
  }

  for (const product of job.products!) {
    const { data: existingProduct, error: selectError } = await supabaseAdmin
      .from("products")
      .select("id, quantity_available, serial_number, quantity_sold")
      .eq("id", product.id);
    console.log("existingProduct: ", existingProduct);
    if (selectError) {
      throw new Error(`Product select failed: ${selectError.message}`);
    }
    if (existingProduct) {
      const updatedSerialNumbers = existingProduct[0].serial_number!.filter(
        (serialNumber) => !product.serial_number.includes(serialNumber)
      );

      const { data: updatedProduct, error: updateError } = await supabaseAdmin
        .from("products")
        .update({
          quantity_available:
            existingProduct![0].quantity_available! - product.quantity,
          quantity_sold: existingProduct![0].quantity_sold + product.quantity,
          serial_number: updatedSerialNumbers,
        })
        .eq("id", existingProduct![0].id);

      if (updateError) {
        throw new Error(`Error updating product: ${updateError.message}`);
      }

      console.log(`Product updated: ${updatedProduct}`);
    }
  }
};

const updateJobRecord = async (job: UpdateJob) => {
  const jobData: UpdateJob = {
    id: job.id,
    invoice_id: job.invoice_id,
    is_paid: job.is_paid,
    is_work_done: job.is_work_done,
    work_completed_date: job.work_completed_date,
    products: job.products,
    customer: job.customer,
    employee: job.employee,
    job_status: job.job_status,
    invoice_status: job.invoice_status,
    address: job.address,
  };

  const { data: jobs, error: updateError } = await supabaseAdmin
    .from("jobs")
    .update(jobData)
    .eq("id", job.id!);
  if (updateError) {
    throw new Error(`Job insert/update failed: ${updateError.message}`);
  }

  return jobs;
};

const deleteJobRecord = async (job: UpdateJob) => {
  const jobData: UpdateJob = {
    id: job.id,
    invoice_id: job.invoice_id,
    is_paid: job.is_paid,
    is_work_done: job.is_work_done,
    work_completed_date: job.work_completed_date,
    products: job.products,
    customer: job.customer,
    employee: job.employee,
    job_status: job.job_status,
    invoice_status: job.invoice_status,
    address: job.address,
    is_deleted: true,
  };

  const { data: jobs, error: updateError } = await supabaseAdmin
    .from("jobs")
    .update(jobData)
    .eq("id", job.id!);
  if (updateError) {
    throw new Error(`Job insert/update failed: ${updateError.message}`);
  }
  for (const product of job.products!) {
    const { data: existingProduct, error: selectError } = await supabaseAdmin
      .from("products")
      .select("id, quantity_sold, quantity_available, serial_number")
      .eq("model_number", product.id);
    if (existingProduct) {
      const updatedQuantity =
        existingProduct[0].quantity_available! + product.quantity;
      const updatedSerialNumbers = [
        ...existingProduct[0].serial_number!,
        ...product.serial_number,
      ];
      const updatedQuantitySold =
        existingProduct[0].quantity_sold! - product.quantity;

      const { data: updatedProduct, error: productError } = await supabaseAdmin
        .from("products")
        .update({
          quantity_sold: updatedQuantitySold,
          quantity_available: updatedQuantity,
          serial_number: updatedSerialNumbers,
        })
        .eq("id", existingProduct[0].id);
      console.log(`Product quantity updated: ${updatedProduct}`);
      if (productError) {
        throw new Error(`Error updating product: ${productError.message}`);
      }
    }
  }
  return jobs;
};

const createProduct = async (product: Product) => {
  const { data: existingProduct, error: selectError } = await supabaseAdmin
    .from("products")
    .select("id, quantity_available, serial_number")
    .eq("model_number", product.model_number as string);

  if (selectError) {
    throw new Error(`Error selecting existing product: ${selectError.message}`);
  }

  if (existingProduct && existingProduct.length > 0) {
    // Check if the serial number already exists in the serial_numbers array
    const serialNumberExists = existingProduct[0].serial_number?.includes(
      product.serial_number
    );
    let updatedQuantity = existingProduct[0].quantity_available!;

    let updatedSerialNumbers = [...existingProduct[0].serial_number!];
    if (!serialNumberExists) {
      updatedSerialNumbers.push(product.serial_number!);
      // Product with the same model_number already exists
      updatedQuantity = existingProduct[0].quantity_available! + 1;
    } else {
      throw new Error(`Serial number exists: ${product.serial_number}`);
    }

    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from("products")
      .update({
        quantity_available: updatedQuantity,
        serial_number: updatedSerialNumbers,
      })
      .eq("id", existingProduct[0].id);

    if (updateError) {
      throw new Error(`Error updating product: ${updateError.message}`);
    }

    console.log(`Product quantity updated: ${existingProduct[0].id}`);
  } else {
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: product.price ?? 0,
      product_data: {
        name: product.name ?? "",
      },
    });
    const productData: Products = {
      id: price.product as string,
      active: product.active,
      description: product.description,
      image: product.image,
      name: product.name,
      quantity_available: 1,
      quantity_sold: 0,
      cost: product.cost,
      model_number: product.model_number,
      serial_number: [product.serial_number],
      brand: product.brand,
      metadata: {},
    };
    // No existing product found, perform upsert operation
    const { data: products, error: upsertError } = await supabaseAdmin
      .from("products")
      .upsert(productData, { onConflict: "model_number" });

    if (upsertError) {
      throw new Error(`Product insert/update failed: ${upsertError.message}`);
    }
  }
};

const upsertJobFromStripe = async (invoice: Stripe.Invoice) => {
  let { data: jobs, error } = await supabaseAdmin
    .from("jobs")
    .select()
    .eq("invoice_id", invoice.id);
  console.log("in invoice.id", jobs, error);

  if (!jobs?.length && invoice.from_invoice) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select()
      .eq("invoice_id", invoice.from_invoice.invoice as string);
    jobs = data;
    console.log("in from_invoice", data, error);
  }
  console.log(jobs);
  let lineItems: any[] = [];
  if (!!invoice.lines.data) {
    lineItems = invoice.lines.data.map((line) => {
      return {
        id: line.price!.product,
        quantity: line.quantity,
        price_id: line.price!.id,
        // Adjust the property names accordingly based on your data structure
      };
    });
  }
  if (jobs) {
    const jobData: JobUpdate = {
      id: jobs[0].id,
      created_at: jobs[0].created_at,
      invoice_id: invoice.id,
      is_paid: invoice.paid,
      is_work_done: false,
      work_completed_date: null,
      products: lineItems as Json[],
      customer: jobs[0].customer,
      employee: jobs[0].employee,
      job_status: "pending",
      invoice_status: invoice.status as
        | "error"
        | "draft"
        | "approved"
        | "paid"
        | "open"
        | "void"
        | null,
      address: jobs[0].address,
    };

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .update(jobData)
      .eq("invoice_id", invoice.id);
    console.log("in update invoice id", data, error);

    if (!data && invoice.from_invoice) {
      const { data, error } = await supabaseAdmin
        .from("jobs")
        .update(jobData)
        .eq("invoice_id", invoice.from_invoice.invoice as string);
      console.log("in update invoice from_id", data, error);
    }
  } else {
    console.log("error ", error);
  }
};

const upsertCustomer = async (customer: Stripe.Customer) => {
  const customerData: Customer = {
    id: customer.id,
    billing_address: customer.address ?? null,
    email: customer.email ?? null,
    full_name: customer.name ?? null,
    phone: customer.phone ?? null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("customers")
    .upsert([customerData]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`
    );

  return customer.id;
};

const upsertSale = async (payment_intent: Stripe.PaymentIntent) => {
  const salesData: Sale = {
    id: payment_intent.id,
    customer_id: (payment_intent.customer as string) ?? null,
    amount: payment_intent.amount ?? null,
    invoice_id: (payment_intent.invoice as string) ?? null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("sales")
    .upsert([salesData]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`
    );

  return payment_intent.id;
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("prices")
    .upsert([priceData]);

  if (upsertError?.message.includes("foreign key constraint")) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

// const deleteProductRecord = async (product: Stripe.Product) => {
//   const { error: deletionError } = await supabaseAdmin
//     .from("products")
//     .delete()
//     .eq("id", product.id);
//   if (deletionError)
//     throw new Error(`Product deletion failed: ${deletionError.message}`);
//   console.log(`Product deleted: ${product.id}`);
// };

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from("prices")
    .delete()
    .eq("id", price.id);
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from("customers")
    .upsert([{ id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`
    );

  return customerId;
};

// const createOrRetrieveCustomer = async ({
//   // email,
//   uuid,
// }: {
//   // email: string;
//   uuid: string;
// }) => {
//   console.log(uuid);
//   // Check if the customer already exists in Supabase
//   const { data: existingSupabaseCustomer, error: queryError } =
//     await supabaseAdmin
//       .from("customers")
//       .select("*")
//       .eq("id", uuid)
//       .maybeSingle();

//   console.log(existingSupabaseCustomer);

//   if (queryError) {
//     throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
//   }

//   // Retrieve the Stripe customer ID using the Supabase customer ID
//   let stripeCustomerId: string | undefined;
//   if (existingSupabaseCustomer?.id) {
//     const existingStripeCustomer = await stripe.customers.retrieve(
//       existingSupabaseCustomer.id
//     );
//     stripeCustomerId = existingStripeCustomer.id;
//   }
//   //else {
//   //   // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
//   //   const stripeCustomers = await stripe.customers.list({ email: email });
//   //   stripeCustomerId =
//   //     stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
//   // }

//   // If still no stripeCustomerId, create a new customer in Stripe
//   const stripeIdToInsert = stripeCustomerId
//     ? stripeCustomerId
//     : await createCustomerInStripe(uuid);
//   /*, email */
//   if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

//   if (existingSupabaseCustomer && stripeCustomerId) {
//     // If Supabase has a record but doesn't match Stripe, update Supabase record
//     if (existingSupabaseCustomer.id !== stripeCustomerId) {
//       const { error: updateError } = await supabaseAdmin
//         .from("customers")
//         .update({ id: stripeCustomerId })
//         .eq("id", uuid);

//       if (updateError)
//         throw new Error(
//           `Supabase customer record update failed: ${updateError.message}`
//         );
//       console.warn(
//         `Supabase customer record mismatched Stripe ID. Supabase record updated.`
//       );
//     }
//     // If Supabase has a record and matches Stripe, return Stripe customer ID
//     return stripeCustomerId;
//   } else {
//     console.warn(
//       `Supabase customer record was missing. A new record was created.`
//     );

//     // If Supabase has no record, create a new record and return Stripe customer ID
//     const upsertedStripeCustomer = await upsertCustomerToSupabase(
//       stripeIdToInsert
//     );
//     if (!upsertedStripeCustomer)
//       throw new Error("Supabase customer record creation failed.");

//     return upsertedStripeCustomer;
//   }
// };

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from("customers")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<"subscriptions"> = {
    id: subscription.id,
    customer_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`
    );
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export {
  // upsertProductRecord,
  upsertPriceRecord,
  upsertSale,
  deletedProductRecord,
  deletePriceRecord,
  // createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  updateProductRecord,
  upsertCustomer,
  upsertJobRecord,
  updateJobRecord,
  deleteJobRecord,
  upsertJobFromStripe,
  createProduct,
};
