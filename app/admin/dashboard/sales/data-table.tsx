"use client";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css";
import { Box, Button, MantineProvider, useMantineTheme } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import { Tables } from "@/types_db";
import { useState } from "react";
import balanceFormat from "@/components/balanceFormat";

type Sales = Tables<"sales">;

const columns: MRT_ColumnDef<Sales>[] = [
  { accessorKey: "id", header: "ID", size: 40 },
  {
    accessorKey: "customer_id",
    header: "Customer Id",
    size: 40,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 60,
    Cell: ({ row }) => (
      <div className="capitalize">{balanceFormat(row.getValue("amount"))}</div>
    ),
  },
  {
    accessorKey: "created",
    header: "Sale Date",
    size: 150,
    Cell: ({ row }) => {
      const currentDate = new Date(row.original.created as string);

      // Create an Intl.DateTimeFormat object for Eastern Time
      const easternTimeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", // 'America/New_York' corresponds to Eastern Time
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // Format the date in Eastern Time
      const formattedDate = easternTimeFormatter.format(currentDate);

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "invoice_id",
    header: "Invoice Id",
    size: 60,
  },
];

const SalesTable = ({ data }: { data: Sales[] }) => {
  const handleExportRows = (rows: MRT_Row<Sales>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,

      styles: {
        overflow: "linebreak",
        fontSize: 5, // Adjust the font size
      },
      showHead: "everyPage",
    });

    doc.save("HRS-Products.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { density: "xs" },
    columnFilterDisplayMode: "popover",
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

  return <MantineReactTable table={table} />;
};

export default SalesTable;
