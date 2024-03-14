import EmployeeTable from "./data-table";
import { Tables, Json } from "@/types_db";
import { createClient } from "@/utils/supabase/server";
import ProductsTable from "./data-table";

type Price = Tables<"prices">;

type Product = {
  active?: boolean | null;
  description?: string | null;
  id: string;
  image?: string | null;
  name?: string | null;
  price?: number | null;
  quantity_available?: number | null;
  quantity_sold?: number | null;
  cost?: number | null;
  model_number?: string | null;
  serial_number?: any[] | null;
  brand?: string | null;
  metadata?: any | null;
};

async function getData(): Promise<Product[]> {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select();

  if (!products) {
    return []; // Return an empty array if products is null
  }

  // Fetch prices for each product and calculate the total price
  const productsWithPrice = await Promise.all(
    products.map(async (product) => {
      const { data: price, error } = await supabase
        .from("prices")
        .select("*")
        .eq("product_id", product.id);
      if (price && price.length > 0) {
        const totalPrice = price.reduce(
          (acc, curr) => acc + curr.unit_amount,
          0
        );
        return { ...product, price: totalPrice };
      }
      return product;
    })
  );

  return [...productsWithPrice];
}

export default async function InventoryPage() {
  const data = await getData();

  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-4 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Inventory
      </h1>
      <div className="container mx-auto py-10">
        <ProductsTable data={data} />
      </div>
    </div>
  );
}
