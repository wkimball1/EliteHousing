"use client";
import CustomerTable from "./data-table";
import { Tables, Json } from "@/types_db";
import { createClient } from "@/utils/supabase/client";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import {
  createAllCustomersInStripe,
  createCustomerInStripe,
} from "@/utils/stripe/server";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@mantine/core";

type Customer = Tables<"customers">;

async function getData(): Promise<Customer[]> {
  const supabase = createClient();
  const { data: customer } = await supabase.from("customers").select("*");
  console.log(customer);
  // Fetch data from your API here.
  return customer || [];
}

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [stripeCustomer, setStripeCustomer] = useState<any | null>({
    name: "",
    phone: "",
    email: "",
    address: { line1: "", line2: "", city: "", state: "", postal_code: "" },
  });
  const [isLoading, setIsLoading] = useState(true);

  const { name, phone, email, address } = stripeCustomer;

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const customerData = await getData();
      if (customerData.length > 0) {
        setData(customerData);
      }
    };

    fetchData();
    setIsLoading(false);
  }, []);

  const handleSubmit = async () => {
    const newCustomer = stripeCustomer;

    const customer = await createCustomerInStripe(newCustomer);
    console.log(customer);
    window.location.reload();
  };
  const addCustomers = async () => {
    const customer = await createAllCustomersInStripe();
    console.log(customer);
    window.location.reload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "name" || name === "email" || name === "phone") {
      setStripeCustomer((prevCustomer: any) => ({
        ...prevCustomer,
        [name]: value,
      }));
    } else if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setStripeCustomer((prevCustomer: any) => ({
        ...prevCustomer,
        address: {
          ...prevCustomer.address,
          [addressField]: value,
        },
      }));
    }
  };

  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-4 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Customers
      </h1>

      <div className="container mx-auto py-10">
        <div className="pb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button color="gray" leftSection={<PlusIcon />}>
                Create new customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[500px] sm:max-h-[600px] md:max-h-[800px] sm:max-w-[425px] md:max-w-[600px]  overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create new customer</DialogTitle>
                <DialogDescription>
                  edit customer information and click submit when ready to
                  create customer
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone #
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="line1" className="text-right">
                    Street Address
                  </Label>
                  <Input
                    id="line1"
                    name="address.line1"
                    value={stripeCustomer.address.line1}
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
                    name="address.line2"
                    value={stripeCustomer.address.line2}
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
                    name="address.city"
                    value={stripeCustomer.address.city}
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
                    name="address.state"
                    value={stripeCustomer.address.state}
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
                    name="address.postal_code"
                    value={stripeCustomer.address.postal_code}
                    onChange={handleChange}
                    className="col-span-3"
                  />
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
                      Create Customer
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CustomerTable data={data} />
      </div>
      <Button color="gray" onClick={() => addCustomers()}>
        Do not click
      </Button>
    </div>
  );
}

// export default function CustomersPage() {
//   return (
//     <div><CustomerPortalForm subscription={null} /></div>
//   )
// }
