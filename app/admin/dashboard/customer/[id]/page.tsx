"use client";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  MinusCircledIcon,
  MinusIcon,
  PlusCircledIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { Check, ChevronsUpDown } from "lucide-react";

import { type Invoice } from "./invoiceType";
import LoadingDots from "@/components/ui/LoadingDots";
import { stripe } from "@/utils/stripe/config";
import {
  createCustomerInvoice,
  createCustomerLineItem,
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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import InvoiceTable from "../columns-invoice";
import balanceFormat from "@/components/balanceFormat";
import Link from "next/link";
import handleStripePortalRequest from "@/components/handle-stripe-portal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Json, Tables, TablesInsert } from "@/types_db";
import { Form } from "react-hook-form";
import { upsertJobRecord } from "@/utils/supabase/admin";
import { supabaseServer } from "@/components/supabaseServer";
import { Divider } from "@mantine/core";

type Job = TablesInsert<"jobs">;

interface TableRow {
  id: string;
  item: string;
  description: string;
  price: number;
  quantity: number;
  open: boolean;
  price_id: string;
}

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseCustomer, setCustomer] = useState<any[] | null>(null);
  const [supabaseProducts, setProducts] = useState<any[] | null>(null);
  const [supabasePrices, setPrices] = useState<any[] | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any | null>(null);
  const [stripeInvoices, setStripeInvoices] = useState<any | null>(null);
  const [value, setValue] = useState("");
  const [balance, setBalance] = useState(0);
  const [total, setTotal] = useState(0);
  const [billing, setBilling] = useState<any | null>({
    line1: "",
    line2: "",
    state: "",
    city: "",
    postal_code: "",
  });
  const [supabaseJob, setSupabaseJob] = useState<Job | null>({
    invoice_id: "",
    is_paid: false,
    is_work_done: false,
    work_completed_date: null,
    products: [],
    customer: "",
    employee: "",
    job_status: "pending",
    invoice_status: "draft",
    address: "",
  });
  const [tableData, setTableData] = useState([
    {
      id: "",
      item: "New Item",
      description: "Description",
      price: 0,
      quantity: 1,
      open: false,
      price_id: "",
    },
  ]);

  const router = useRouter();

  const addRow = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        id: "",
        item: "New Item",
        description: "",
        price: 0,
        quantity: 1,
        open: false,
        price_id: "",
      },
    ]);
  };

  const deleteRow = (index: number) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  const [invoiceData, setNewInvoice] = useState<any | null>({
    customer: "",
    description: "",
    metadata: { job_id: "" },
  });

  const supabase = createClient();
  const pathName = usePathname();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const custId = params.id;
      console.log(params);
      try {
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("id", custId);
        setCustomer(customer);
        console.log(customer);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log(user!.id);
        setNewInvoice({
          ...invoiceData,
          customer: custId,
          metadata: { employee: user!.id },
        });

        const { data: products } = await supabase.from("products").select("*");
        setProducts(products);
        console.log(products);

        const { data: prices } = await supabase.from("prices").select("*");
        setPrices(prices);
        console.log(prices);
        const existingStripeCustomer = await retrieveCustomer({ id: custId! });
        console.log(existingStripeCustomer);
        setStripeCustomer(existingStripeCustomer);
        const stripeCustomerInvoices = await retrieveCustomerInvoices({
          id: custId!,
        });
        if (stripeCustomerInvoices) {
          const validInvoices = stripeCustomerInvoices.filter(
            (invoice: Invoice) =>
              invoice.status !== "Void" && invoice.status !== "Uncollectable"
          );

          // Extract amounts due from each valid invoice and sum them up
          const totalAmountDue = validInvoices.reduce(
            (total: number, invoice: Invoice) => total + invoice.amount_due,
            0
          );
          setBalance(totalAmountDue);
        }
        setStripeInvoices(stripeCustomerInvoices);
        console.log(stripeCustomerInvoices);
        setBilling(customer![0].billing_address);
      } catch (err) {
        console.log("Error occured when fetching data" + err);
      }
      setIsLoading(false);
    })();
  }, []);

  const handleSubmit = async () => {
    const newJob = supabaseJob!;
    console.log("tableData:", tableData);
    newJob.products = tableData.map((data) => {
      const container = {
        id: data.id,
        quantity: data.quantity,
        price_id: data.price_id,
      };
      return container;
    });
    newJob.customer = supabaseCustomer![0].id;
    newJob.employee = invoiceData.metadata.employee;
    newJob.address = billing;
    console.log("newJob", newJob);
    const invoiceId = await createCustomerInvoice(invoiceData);
    const InvoiceItem = await createCustomerLineItem(
      invoiceId,
      tableData,
      supabaseCustomer![0]
    );
    newJob.invoice_id = invoiceId;
    const jobs = await supabaseServer(newJob);
    setTableData([
      {
        id: "",
        item: "New Item",
        description: "",
        price: 0,
        quantity: 1,
        open: false,
        price_id: "",
      },
    ]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setBilling((prevBilling: any) => {
      return {
        ...prevBilling,
        [e.target.name]: e.target.value,
      };
    });
  };
  useEffect(() => {
    // Calculate the new total whenever tableData changes
    const newTotal = tableData.map((item) => {
      // Check if both item.price and item.quantity are not NaN
      if (!isNaN(item.price) && !isNaN(item.quantity)) {
        return item.price * item.quantity;
      } else {
        // If either price or quantity is NaN, return 0
        return 0;
      }
    });
    const totalSum = newTotal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    // Update the state with the new total
    setTotal(totalSum);
  }, [tableData]);

  const addressFormat = (address: any) => {
    const billingAddress = address; // Access the original data

    // Access the "line1" property from the billing address object
    const line1 =
      billingAddress && billingAddress.line1 ? billingAddress.line1 : "";
    const line2 =
      billingAddress && billingAddress.line2 ? billingAddress.line2 : "";
    const state =
      billingAddress && billingAddress.state ? billingAddress.state : "";
    const city =
      billingAddress && billingAddress.city ? billingAddress.city : "";
    const zip =
      billingAddress && billingAddress.postal_code
        ? billingAddress.postal_code
        : "";

    // Combine line1 and city, separating them with a comma and space
    const combinedAddress = `${line1}${line1 && line2 ? ", " : ""}${line2}${
      line1 && city ? ", " : ""
    }${city}${city && state ? ", " : ""}${state}${
      (line1 || city || state) && zip ? " " : ""
    }${zip}`;
    return combinedAddress;
  };

  if (!supabaseCustomer || isLoading) {
    return (
      <div className="m-auto">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-wrap max-w-full justify-center items-start px-2 py-5">
        <div className="flex-auto w-40 flex-col md:basis-1/4 leading-tight tracking-tighter lg:leading-[1.1]">
          <h1 className="text-2xl font-bold md:text-3xl dark:text-stone-300 pt-2">
            {!!supabaseCustomer[0] && !!supabaseCustomer[0].full_name
              ? supabaseCustomer[0].full_name
              : " "}
          </h1>
          <div className="items-start justify-start pt-10">
            <div className="items-start justify-start text-md font-bold">
              <h2>Customer ID</h2>
            </div>
            <div className="items-start justify-start pt-2 text-sm">
              {!!supabaseCustomer[0] && !!supabaseCustomer[0].id ? (
                <h2>{supabaseCustomer![0].id}</h2>
              ) : (
                <h2>No ID found</h2>
              )}
            </div>
            <div className="items-start justify-start text-md font-bold pt-6">
              <h2>Email</h2>
            </div>
            <div className="items-start justify-start pt-2 text-sm">
              {!!supabaseCustomer[0] && !!supabaseCustomer![0].email ? (
                <h2>{supabaseCustomer![0].email}</h2>
              ) : (
                <h2>No email found</h2>
              )}
            </div>
            <div className="items-start justify-start text-md font-bold pt-6">
              <h2>Address</h2>
            </div>
            <div className="items-start justify-start py-2 text-sm">
              {!!supabaseCustomer[0] &&
              !!supabaseCustomer![0].billing_address ? (
                <h2>{addressFormat(supabaseCustomer![0].billing_address)}</h2>
              ) : (
                <h2>No address found</h2>
              )}
            </div>
            <div className="items-start justify-start py-4 text-sm">
              {!!supabaseCustomer[0] && !!supabaseCustomer![0].id ? (
                <Button
                  className="bg-background text-foreground hover:bg-slate-500"
                  variant="outline"
                  onClick={() =>
                    handleStripePortalRequest(supabaseCustomer[0].id, pathName)
                  }
                >
                  Open customer portal
                </Button>
              ) : (
                <h2>No address found</h2>
              )}
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-background text-foreground hover:bg-slate-500"
                    variant="outline"
                  >
                    Create new job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[500px] sm:max-h-[600px] md:max-h-[800px] sm:max-w-[425px] md:max-w-[600px]  overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create new job</DialogTitle>
                    <DialogDescription>
                      edit job information and click submit when ready to create
                      invoice
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Customer Name
                      </Label>
                      <Input
                        id="name"
                        value={supabaseCustomer[0].full_name}
                        className="col-span-3"
                        readOnly
                        autoFocus
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="line1" className="text-right">
                        Street Address
                      </Label>
                      <Input
                        id="line1"
                        value={billing.line1}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="line2" className="text-right">
                        Apt, Unit, etc. (optional)
                      </Label>
                      <Input
                        id="line2"
                        value={billing.line2}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="city" className="text-right">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={billing.city}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="state" className="text-right">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={billing.state}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="postal_code" className="text-right">
                        Zip Code
                      </Label>
                      <Input
                        id="postal_code"
                        value={billing.postal_code}
                        onChange={handleChange}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-span-4">
                        {/* Add your table component here */}
                        <Table>
                          {/* Table headers */}
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-6"></TableHead>
                              <TableHead className="text-left">Item</TableHead>
                              <TableHead colSpan={3} className="">
                                Price
                              </TableHead>
                              <TableHead className="text-center">
                                Quantity
                              </TableHead>
                              {/* Add more header columns if needed */}
                            </TableRow>
                          </TableHeader>
                          {/* Table body with selectable items */}
                          <TableBody>
                            {tableData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="w-6">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteRow(index)}
                                    className="bg-red-500 h-5 w-5 rounded-3xl hover:bg-red-600"
                                  >
                                    <MinusIcon
                                      color="white"
                                      className="h-4 w-4"
                                    />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Popover
                                    open={row.open}
                                    onOpenChange={(newState) => {
                                      const newData = [...tableData];
                                      newData[index].open = newState;
                                      setTableData(newData);
                                    }}
                                  >
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={row.open}
                                        className="w-[300px] justify-between hover:bg-background"
                                      >
                                        {value ? row.item : "Select product..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0 bg-background max-h-200px overflow-y-auto ">
                                      <Command>
                                        <CommandInput placeholder="Search products..." />
                                        <CommandEmpty>
                                          No products found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {supabaseProducts!.map((product) => (
                                            <CommandItem
                                              key={product.id}
                                              value={product.name}
                                              className="bg-background aria-selected:bg-background"
                                              onSelect={(currentValue) => {
                                                console.log(currentValue);
                                                setValue(currentValue);
                                                const newData = [...tableData];
                                                newData[index].id = product.id;
                                                newData[index].item =
                                                  currentValue;
                                                newData[index].description =
                                                  product.description;
                                                if (supabasePrices !== null) {
                                                  const prices =
                                                    supabasePrices!.find(
                                                      (price) =>
                                                        price.product_id ===
                                                        product.id
                                                    );
                                                  newData[index].price =
                                                    prices.unit_amount;
                                                  newData[index].price_id =
                                                    prices.id;
                                                }
                                                newData[index].open = false;
                                                setTableData(newData);
                                              }}
                                            >
                                              {row.item === product.name && (
                                                <Check className="mr-2 h-4 w-4 opacity-100" />
                                              )}

                                              {product.name}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </TableCell>
                                <TableCell colSpan={3}>
                                  <Input
                                    type="currency"
                                    readOnly
                                    value={balanceFormat(row.price.toString())}
                                  />
                                </TableCell>
                                <TableCell className="w-20">
                                  <Input
                                    type="number"
                                    value={row.quantity}
                                    onChange={(e) => {
                                      const newData = [...tableData];

                                      // Check if the input is not empty
                                      if (e.target.value !== "") {
                                        const parsedValue = parseInt(
                                          e.target.value,
                                          10
                                        );

                                        // Check if parsedValue is a valid number
                                        if (!isNaN(parsedValue)) {
                                          newData[index].quantity = parsedValue;
                                          setTableData(newData);
                                        } else {
                                          // Handle the case where the input is not a valid number, e.g., display an error message
                                          console.error(
                                            "Invalid quantity input"
                                          );
                                        }
                                      } else {
                                        // Handle the case where the input is empty (optional: set quantity to 0)
                                        newData[index].quantity = 0; // optional: set quantity to 0
                                        // setTableData(newData); // optional: update the state even for empty input
                                      }
                                    }}
                                  />
                                </TableCell>
                                {/* Add more cells for each row if needed */}
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={2}>
                                <Button
                                  variant="ghost"
                                  onClick={() => addRow()}
                                  className="bg-blue-500 text-sm text-foreground hover:bg-blue-600"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  Add item
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Label htmlFor="total">Total:</Label>
                                <Input
                                  id="total"
                                  value={balanceFormat(total.toString() ?? "0")}
                                  className="col-span-3"
                                  readOnly
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <div className="flex justify-between space-x-6">
                        <Button
                          variant="outline"
                          type="button"
                          className="text-sm text-foreground hover:bg-red-500"
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="outline"
                          type="submit"
                          className="bg-background text-foreground hover:bg-stone-500"
                          onClick={handleSubmit}
                        >
                          Create Job
                        </Button>
                      </div>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:basis-3/4 pt-6 w-full max-w-sm md:max-w-full">
          <div className="flex flex-row gap-4 justify-center items-center">
            <Card className="w-25 h-25 md:w-32 lg:w-60 bg-background ">
              <CardHeader className="items-center text-sm md:text-xl">
                <CardTitle>Amount Due</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 items-center justify-center">
                <p className="text-xs md:text-xl">
                  {balanceFormat(balance.toString())}
                </p>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </div>

          <div className="w-full pt-6">
            {!!stripeInvoices ? (
              <InvoiceTable data={[...stripeInvoices] as Invoice[]} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
}
