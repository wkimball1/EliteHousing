import CustomerTable from "./data-table";
import { Tables, Json } from "@/types_db";
import { createClient } from "@/utils/supabase/server";

type Customer = Tables<"customers">;

async function getData(): Promise<Customer[]> {
  const supabase = createClient();
  const { data: customers, error } = await supabase.from("customers").select();
  // Fetch data from your API here.
  if (customers) return [...customers!];
  return [];
}

export default async function CustomersPage() {
  const data = await getData();
  console.log(data);

  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-4 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Customers
      </h1>
      <div className="container mx-auto py-10">
        <CustomerTable data={data} />
      </div>
    </div>
  );
}

// export default function CustomersPage() {
//   return (
//     <div><CustomerPortalForm subscription={null} /></div>
//   )
// }
