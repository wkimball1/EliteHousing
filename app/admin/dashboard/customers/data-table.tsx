"use client";
import * as React from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import { Box, Button, MantineProvider } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";

import { Tables } from "@/types_db";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

type Customers = Tables<"customers">;

// type Customers = {
//   id: string;
//   full_name: string;
//   email: string;
//   billing_address: {
//     line1: string;
//     line
//     city: string;
//     state: string;
//     postal_code: string;
//   };
//   // Add other properties as needed
// };

const columns: MRT_ColumnDef<Customers>[] = [
  { accessorKey: "id", header: "Id", size: 80 },
  { accessorKey: "full_name", header: "Name", size: 80 },
  {
    accessorKey: "email",
    header: "Email",
    size: 80,
    Cell: ({ renderedCellValue }) => (
      <div className="lowercase">{renderedCellValue}</div>
    ),
  },
  {
    accessorKey: "billing_address",
    header: "Address",
    size: 120,
    Cell: ({ row }) => {
      const { city, line1, line2, state, country, postal_code } =
        row.original.billing_address || {};
      const addressString = `${line1}${line1 && line2 ? ", " : ""}${line2}${
        line1 && city ? ", " : ""
      }${city}${city && state ? ", " : ""}${state}${
        (line1 || city || state) && postal_code ? " " : ""
      }${postal_code}`;
      return <div>{addressString}</div>;
    },
  },
  { accessorKey: "phone", header: "Phone #", size: 60 },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 40,
    enableColumnActions: false,
    enableColumnFilter: false,
    enableSorting: false,
    Cell: ({ row }) => {
      const customer = row.original;
      const router = useRouter();
      const searchParams = useSearchParams();

      const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set(name, value);

          return params.toString();
        },
        [searchParams]
      );
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="subtle" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                router.push("/admin/dashboard/customer/" + customer.id)
              }
            >
              View customer details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const CustomerTable = ({ data }: { data: Customers[] }) => {
  const handleExportRows = (rows: MRT_Row<Customers>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) =>
      columns
        .filter((column) => column.accessorKey !== "actions")
        .map((column) => {
          if (column.accessorKey === "billing_address") {
            const { city, line1, line2, state, country, postal_code } =
              row.original.billing_address || {};
            return `${line1}${line1 && line2 ? ", " : ""}${line2}${
              line1 && city ? ", " : ""
            }${city}${city && state ? ", " : ""}${state}${
              (line1 || city || state) && postal_code ? " " : ""
            }${postal_code}`;
          }
          return row.original[column.accessorKey as keyof Customers];
        })
    );

    const tableHeaders = columns
      .map((c) => c.header)
      .filter((header) => header !== "Actions");

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("HRS-Customers.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { density: "xs", showColumnFilters: true },
    columnFilterDisplayMode: "subheader",
    paginationDisplayMode: "pages",
    enableGlobalFilter: false,
    enableEditing: true,
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          leftSection={<IconDownload />}
        >
          Export All Rows
        </Button>
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftSection={<IconDownload />}
        >
          Export Page Rows
        </Button>
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftSection={<IconDownload />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <MantineProvider defaultColorScheme="auto">
      <MantineReactTable table={table} />
    </MantineProvider>
  );
};

export default CustomerTable;
