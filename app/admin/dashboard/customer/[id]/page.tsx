"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import LoadingDots from "@/components/ui/LoadingDots";
import { stripe } from "@/utils/stripe/config";
import {
  retrieveCustomer,
  retrieveCustomerInvoices,
} from "@/utils/stripe/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableInvoices } from "../data-table-invoice";
import { columns } from "../columns-invoice";
import balanceFormat from "@/components/balanceFormat";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<any[] | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any | null>(null);
  const [stripeInvoices, setStripeInvoices] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const custId = params.id;
      console.log(params);
      try {
        const { data: customer, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", custId);
        setCustomer(customer);
        console.log(customer);
        const existingStripeCustomer = await retrieveCustomer({ id: custId! });
        setStripeCustomer(existingStripeCustomer);
        const stripeCustomerInvoices = await retrieveCustomerInvoices({
          id: custId!,
        });
        setStripeInvoices(stripeCustomerInvoices);
        console.log(stripeCustomerInvoices);
      } catch (err) {
        console.log("Error occured when fetching data" + err);
      }
      setIsLoading(false);
    })();
  }, []);

  const addressFormat = (address: any) => {
    const billingAddress = address; // Access the original data

    // Access the "line1" property from the billing address object
    const line1 =
      billingAddress && billingAddress.line1 ? billingAddress.line1 : "N/A";
    const state =
      billingAddress && billingAddress.state ? billingAddress.state : "";
    const city =
      billingAddress && billingAddress.city ? billingAddress.city : "";
    const zip =
      billingAddress && billingAddress.postal_code
        ? billingAddress.postal_code
        : "";

    // Combine line1 and city, separating them with a comma and space
    const combinedAddress = `${line1}${line1 && city ? ", " : ""}${city}${
      city && state ? ", " : ""
    }${state}${(line1 || city || state) && zip ? " " : ""}${zip}`;
    return combinedAddress;
  };

  if (!customer || isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-wrap max-w-full justify-center items-start px-2 py-5">
        <div className="flex-auto w-40 flex-col md:basis-1/4 leading-tight tracking-tighter lg:leading-[1.1]">
          <h1 className="text-lg font-bold md:text-3xl ">
            {!!customer[0] && !!customer[0].full_name
              ? customer[0].full_name
              : " "}
          </h1>
          <div className="items-start justify-start pt-10">
            <div className="items-start justify-start text-md font-bold">
              <h2>Customer ID</h2>
            </div>
            <div className="items-start justify-start pt-2 text-sm">
              {!!customer[0] && !!customer[0].id ? (
                <h2>{customer![0].id}</h2>
              ) : (
                <h2>No ID found</h2>
              )}
            </div>
            <div className="items-start justify-start text-md font-bold pt-6">
              <h2>Email</h2>
            </div>
            <div className="items-start justify-start pt-2 text-sm">
              {!!customer[0] && !!customer![0].email ? (
                <h2>{customer![0].email}</h2>
              ) : (
                <h2>No email found</h2>
              )}
            </div>
            <div className="items-start justify-start text-md font-bold pt-6">
              <h2>Address</h2>
            </div>
            <div className="items-start justify-start py-2 text-sm">
              {!!customer[0] && !!customer![0].billing_address ? (
                <h2>{addressFormat(customer![0].billing_address)}</h2>
              ) : (
                <h2>No address found</h2>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:basis-3/4 pt-6 w-full max-w-sm md:max-w-full">
          <div className="flex flex-row gap-4 justify-center items-center">
            <Card className="w-25 h-25 md:w-32 lg:w-60  md:h-fit bg-background ">
              <CardHeader className="items-center text-sm md:text-xl">
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 items-center justify-center">
                <p className="text-xs md:text-xl">
                  {!!stripeCustomer && !!stripeCustomer.balance
                    ? balanceFormat(stripeCustomer!.balance)
                    : balanceFormat("0")}
                </p>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card className="w-25 h-25 md:w-32 lg:w-60 md:h-fit bg-background">
              <CardHeader className="items-center text-sm md:text-xl">
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 items-center justify-center">
                <p className="text-xs md:text-xl">
                  {!!stripeCustomer && !!stripeCustomer.balance
                    ? balanceFormat(stripeCustomer!.balance)
                    : balanceFormat("0")}
                </p>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
            <Card className="w-25 h-25 md:w-32 lg:w-60  md:h-fit bg-background">
              <CardHeader className="items-center text-sm md:text-xl">
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 items-center justify-center">
                <p className="text-xs md:text-xl">
                  {!!stripeCustomer && !!stripeCustomer.balance
                    ? balanceFormat(stripeCustomer!.balance)
                    : balanceFormat("0")}
                </p>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>
          <div className="w-full">
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>
              <TabsContent value="invoices">
                {!!stripeInvoices ? (
                  <DataTableInvoices
                    columns={columns}
                    data={[...stripeInvoices]}
                  />
                ) : (
                  <></>
                )}
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged
                      out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
