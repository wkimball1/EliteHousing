import { Json, Tables } from "@/types_db";
import { createClient } from "@/utils/supabase/server";
import ProductsTable from "./data-table";
import SalesTable from "./data-table";

type Sales = Tables<"sales">;

async function getData(): Promise<Sales[]> {
  const supabase = createClient();
  const { data: sales, error } = await supabase.from("sales").select("*");
  console.log(sales);
  console.log(error);
  if (!sales) {
    return []; // Return an empty array if products is null
  }

  return [...sales];
}

export default async function SalesPage() {
  const data = await getData();

  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-4 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Sales
      </h1>
      <div className="container mx-auto py-10">
        <SalesTable data={data} />
      </div>
    </div>
  );
}
