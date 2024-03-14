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

type Product = {
  active?: boolean | null;
  description?: string | null;
  id?: string;
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

const columns: MRT_ColumnDef<Product>[] = [
  { accessorKey: "id", header: "ID", size: 40 },
  {
    accessorKey: "active",
    header: "Active",
    size: 40,
  },
  { accessorKey: "name", header: "Name", size: 60 },
  { accessorKey: "description", header: "Description", size: 60 },
  {
    accessorKey: "price",
    header: "Price",
    size: 60,
    Cell: ({ row }) => (
      <div className="capitalize">{balanceFormat(row.getValue("price"))}</div>
    ),
  },
  {
    accessorKey: "cost",
    header: "Cost",
    size: 60,
    Cell: ({ row }) => (
      <div className="capitalize">{balanceFormat(row.getValue("cost"))}</div>
    ),
  },
  {
    accessorKey: "quantity_sold",
    header: "# Sold",
    size: 60,
  },
  { accessorKey: "quantity_available", header: "# Available", size: 60 },
  { accessorKey: "model_number", header: "Model #", size: 60 },
  { accessorKey: "brand", header: "Brand", size: 40 },
];

const ProductsTable = ({ data }: { data: any }) => {
  const handleExportRows = (rows: MRT_Row<Product>[]) => {
    const doc = new jsPDF();
    console.log(data);
    const tableData = rows.map((row) =>
      columns.map((column) => {
        // Handle the price column separately to format it and set a default value if empty
        if (column.accessorKey === "price") {
          const price = row.original.price
            ? balanceFormat(row.original.price.toString())
            : "$0.00";
          return price;
        } else {
          return row.original[column.accessorKey as keyof Product];
        }
      })
    );
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

export default ProductsTable;
