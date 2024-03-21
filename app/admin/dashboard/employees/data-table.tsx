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
import { useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import balanceFormat from "@/components/balanceFormat";

type Employees = Tables<"users">;

const EmployeeTable = ({ data }: { data: Employees[] }) => {
  const columns = useMemo<MRT_ColumnDef<Employees>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        size: 80,
        Cell: ({ row }) => (
          <div className="capitalize">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "full_name",
        header: "Name",
        size: 80,
        Cell: ({ row }) => (
          <div className="capitalize">{row.getValue("full_name")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 80,
        Cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "work_location",
        header: "Work Location",
        size: 80,
        Cell: ({ row }) => {
          return (
            <div className="capitalize">{row.getValue("work_location")}</div>
          );
        },
      },
      {
        accessorKey: "job_role",
        header: "Job Role",
        size: 80,
        Cell: ({ row }) => {
          return <div className="capitalize">{row.getValue("job_role")}</div>;
        },
      },
      {
        accessorFn: (originalRow) => originalRow.salary! / 100 || 0,
        id: "salary",
        header: "Salary",
        // default (or between)

        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
        filterFn: "between",
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 120,
        Cell: ({ row }) => {
          if (
            row.original.address &&
            typeof row.original.address === "object"
          ) {
            const { city, line1, line2, state, postal_code } =
              row.original.address;
            // Further code handling the destructured properties
            // For example, constructing the addressString as in your original code snippet
            const addressString = `${line1}${
              line1 && line2 ? ", " : ""
            }${line2}${line1 && city ? ", " : ""}${city}${
              city && state ? ", " : ""
            }${state}${
              (line1 || city || state) && postal_code ? " " : ""
            }${postal_code}`;
            return <div>{addressString}</div>;
          } else {
            // Handle the case when row.original.address is null, undefined, or not an object
            return <div>No address available</div>; // Or any other appropriate message or action
          }
        },
      },
    ],
    []
  );

  const handleExportRows = (rows: MRT_Row<Employees>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) =>
      columns
        .filter((column) => column.accessorKey !== "avatar_url")
        .map((column) => {
          if (column.accessorKey === "address") {
            const { city, line1, line2, state, country, postal_code } =
              row.original.address || {};
            return `${line1}${line1 && line2 ? ", " : ""}${line2}${
              line1 && city ? ", " : ""
            }${city}${city && state ? ", " : ""}${state}${
              (line1 || city || state) && postal_code ? " " : ""
            }${postal_code}`;
          }
          if (column.id === "salary") {
            return balanceFormat(row.original.salary?.toString() || "0");
          }
          return row.original[column.accessorKey as keyof Employees];
        })
    );
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,

      styles: {
        overflow: "linebreak",
        fontSize: 6, // Adjust the font size
      },
      showHead: "everyPage",
    });

    doc.save("HRS-Employees.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { density: "xs", showColumnFilters: true },
    columnFilterDisplayMode: "subheader",
    enableGlobalFilter: false,
    paginationDisplayMode: "pages",
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

export default EmployeeTable;
