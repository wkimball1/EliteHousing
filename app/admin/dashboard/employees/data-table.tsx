"use client";
import * as React from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import { Box, Button } from "@mantine/core";
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

type Employees = Tables<"users">;

const columns: MRT_ColumnDef<Employees>[] = [
  {
    accessorKey: "id",
    header: "Id",
    size: 120,
    Cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "full_name",
    header: "Name",
    size: 120,
    Cell: ({ row }) => (
      <div className="capitalize">{row.getValue("full_name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 120,
    Cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "work_location",
    header: "Work Location",
    size: 120,
    Cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("work_location")}</div>;
    },
  },
];

const EmployeeTable = ({ data }: { data: Employees[] }) => {
  const handleExportRows = (rows: MRT_Row<Employees>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) =>
      columns
        .filter((column) => column.accessorKey !== "avatar_url")
        .map((column) => row.original[column.accessorKey as keyof Employees])
    );
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
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
          leftIcon={<IconDownload />}
        >
          Export All Rows
        </Button>
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftIcon={<IconDownload />}
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
          leftIcon={<IconDownload />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MantineReactTable table={table} />;
};

export default EmployeeTable;
