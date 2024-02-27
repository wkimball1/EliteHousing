import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Tables, Json } from '@/types_db';
import { createClient } from '@/utils/supabase/server';

type Customer = Tables<'customers'>;



async function getData(): Promise<Customer[]> {

  const supabase = createClient();
  const { data: customers } = await supabase.from("customers").select();
  // Fetch data from your API here.
  if (!!customers)
    return [...customers!];
  return [];
}
 
export default async function CustomersPage() {
  const data = await getData()
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}










// export default function CustomersPage() {
//   return (
//     <div><CustomerPortalForm subscription={null} /></div>
//   )
// }
