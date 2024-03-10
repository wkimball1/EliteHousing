// "use client";

// import React from "react";
// import {
//   MRT_ColumnDef,
//   MantineReactTable,
//   useMantineReactTable,
//   MRT_Row,
// } from "mantine-react-table";
// import {
//   Checkbox,
//   Button,
// } from "@mantine/core";
// import { useRouter, useSearchParams } from "next/navigation"; // Import your router library
// import { CaretSortIcon } from "@radix-ui/react-icons";

// type Customer = {
//   id: string;
//   full_name: string;
//   email: string;
//   billing_address: {
//     line1: string;
//     city: string;
//     state: string;
//     postal_code: string;
//   };
//   // Add other properties as needed
// };

// const columns: MRT_ColumnDef<Customer>[] = [
//   {
//     id: "select",
//     header: ({ table }: { table: any }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   // ... other columns
//   {
//     accessorKey: "id",
//     header: "Id",
//     cell: (row: MRT_Row<Customer>) => <div className="capitalize">{row.getValue("id")}</div>,
//   },
//   {
//     accessorKey: "full_name",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         className="pl-0"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Name
//         <CaretSortIcon className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: (row: MRT_Row<Customer>) => (
//       <div className="capitalize">{row.getValue("full_name")}</div>
//     ),
//   },
//   // ... other columns
// ];

// const CustomerTable: React.FC<{ data: Customer[] }> = ({ data }) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const createQueryString = React.useCallback(
//     (name: string, value: string) => {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set(name, value);

//       return params.toString();
//     },
//     [searchParams]
//   );

//   const handleActions = (row: MRT_Row<Customer>) => (
//     <div>
//       <Button onClick={() => navigator.clipboard.writeText(row.original.id)}>
//         Copy customer ID
//       </Button>
//       <Button
//         onClick={() =>
//           router.push(`/admin/dashboard/customer/${row.original.id}`)
//         }
//       >
//         View customer details
//       </Button>
//     </div>
//   );

//   const table = useMantineReactTable({
//     columns,
//     data,
//     renderCell: ({ column, row }) => {
//       if (column.id === "actions") {
//         return handleActions(row);
//       }
//       return column.renderCell ? column.renderCell({ column, row }) : null;
//     },
//   });

//   return <MantineReactTable table={table} />;
// };

// export default CustomerTable;
