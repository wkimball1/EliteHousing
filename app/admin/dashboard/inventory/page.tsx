"use client";

import { Tables, Json } from "@/types_db";
import { createClient } from "@/utils/supabase/client";
import ProductsTable from "./data-table";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { createProduct } from "@/utils/supabase/admin";
import {
  loadProductsToSupabase,
  supabaseProductCreate,
} from "@/components/supabaseServer";

type Price = Tables<"prices">;

export type Product = {
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
  console.log("data", products);

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

export default function InventoryPage() {
  const [data, setData] = useState<Product[]>([]);
  const [cost, setCost] = useState<string | number>("");
  const [price, setPrice] = useState<string | number>("");
  const [product, setProduct] = useState<any | null>({
    active: true,
    description: "",
    image: null,
    name: "",
    price: 0,
    quantity_available: 0,
    quantity_sold: 0,
    cost: 0,
    model_number: "",
    serial_number: [],
    brand: "",
    metadata: {},
  });
  const [isLoading, setIsLoading] = useState(true);

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
    const newProduct = {
      ...product,
      price: parseFloat(String(price)) * 100,
      cost: parseFloat(String(cost)) * 100,
    };

    const stripeProduct = await supabaseProductCreate(newProduct);
    console.log(stripeProduct);
    window.location.reload();
  };

  const loadProducts = async () => {
    const products = await loadProductsToSupabase();
    console.log(products);
    window.location.reload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-4 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Inventory
      </h1>
      <div className="container mx-auto py-10">
        <div className="pb-4 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button color="grey" leftSection={<PlusIcon />}>
                Add new Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[500px] sm:max-h-[600px] md:max-h-[800px] sm:max-w-[425px] md:max-w-[600px]  overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add new product</DialogTitle>
                <DialogDescription>
                  edit product information and click submit when ready to add
                  product
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
                    value={product.name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="brand" className="text-right">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model_number" className="text-right">
                    Model #
                  </Label>
                  <Input
                    id="model_number"
                    name="model_number"
                    value={product.model_number}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serial_number" className="text-right">
                    Serial #
                  </Label>
                  <Input
                    id="serial_number"
                    name="serial_number"
                    value={product.serial_number}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Unit Price
                  </Label>
                  <NumberInput
                    id="price"
                    name="price"
                    value={price}
                    onChange={setPrice}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">
                    Cost to Ship
                  </Label>
                  <NumberInput
                    id="cost"
                    name="cost"
                    value={cost}
                    onChange={setCost}
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
                      Add Product
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ProductsTable data={data} />
      </div>
      <span className="pt-4" />
      <Button color="grey" onClick={loadProducts}>
        Do Not Click
      </Button>
    </div>
  );
}
