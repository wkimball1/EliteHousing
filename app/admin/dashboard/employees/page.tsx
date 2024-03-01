import { columns } from "./columns";
import { DataTableEmployees } from "./data-table";
import { Tables, Json } from "@/types_db";
import { createClient } from "@/utils/supabase/server";

type User = Tables<"users">;

async function getData(): Promise<User[]> {
  const supabase = createClient();
  const { data: users, error } = await supabase.from("users").select();
  // Fetch data from your API here.
  if (users) {
    users.map((user) => {
      if (user.full_name == null) {
        user.full_name = "";
      }
      if (user.work_location == null) {
        user.work_location = "";
      }
    });
    return [...users!];
  }
  return [];
}

export default async function EmployeesPage() {
  const data = await getData();
  console.log(data);

  return (
    <div className="flex flex-col w-full max-w-full justify-start items-center py-20 px-2">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Employees
      </h1>
      <div className="container mx-auto py-10">
        <DataTableEmployees columns={columns} data={data} />
      </div>
    </div>
  );
}
