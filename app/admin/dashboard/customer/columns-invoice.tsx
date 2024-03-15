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

import { IconDownload } from "@tabler/icons-react";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";

import { Input } from "@/components/ui/input";
import { type Invoice } from "./[id]/invoiceType";

import { Checkbox } from "@/components/ui/checkbox";
import { createStripePortal, finalizeInvoice } from "@/utils/stripe/server";
import handleStripePortalRequest from "@/components/handle-stripe-portal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Stripe from "stripe";
import balanceFormat from "@/components/balanceFormat";
import Link from "next/link";
import InvoiceDialog from "./[id]/InvoiceDialog";
import { Dialog } from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Box, Button, MantineProvider } from "@mantine/core";
import { Button as ShadButton } from "@/components/ui/button";

const TimestampConverter = (timestamp: any) => {
  // Convert Unix timestamp to milliseconds
  const date = new Date(timestamp * 1000);

  // Get month and day
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date
  );
  const day = date.getDate();

  // Construct the formatted string
  return `${month} ${day}`;
};

const getColorClass = (status: string) => {
  switch (status) {
    case "draft":
      return "blue";
    case "open":
      return "yellow";
    case "paid":
      return "teal";
    case "uncollectable":
      return "orange";
    case "void":
      return "grey";
    default:
      return "blue";
  }
};

const columns: MRT_ColumnDef<Invoice>[] = [
  {
    accessorKey: "amount_remaining",
    header: "Amount Due",
    size: 120,
    Cell: ({ row }) => (
      <div className="capitalize">
        {balanceFormat(row.getValue("amount_remaining"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    Cell: ({ row }) => {
      return (
        <div>
          <Button
            variant="filled"
            className="capitalize enabled:pointer-events-none"
            color={getColorClass(row.getValue("status"))}
          >
            {row.getValue("status")}
          </Button>
        </div>
      );
    },
  },
  { accessorKey: "id", header: "Invoice Id", size: 300 },
  {
    accessorKey: "due_date",
    header: "Due Date",
    size: 120,
    Cell: ({ row }) => (
      <div className="capitalize">
        {!!row.getValue("due_date")
          ? TimestampConverter(row.getValue("due_date"))
          : "none"}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 40,
    Cell: ({ row }) => {
      const invoice: any = row.original;

      const router = useRouter();
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="subtle" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background flex flex-col items-center text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <InvoiceDialog invoice={invoice} />
              {invoice.status === "draft" && (
                <ShadButton
                  variant="ghost"
                  className="font-normal hover:bg-background focus:bg-background pb-2"
                  onClick={() => {
                    finalizeInvoice(invoice.id);
                    window.location.reload();
                  }}
                >
                  Finalize Invoice
                </ShadButton>
              )}
              {invoice.status !== "draft" && (
                <>
                  <Link
                    href={
                      !!invoice && !!invoice.invoice_pdf
                        ? invoice.invoice_pdf
                        : ""
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                    className={
                      !!invoice && !!invoice.invoice_pdf
                        ? ""
                        : "pointer-events-none"
                    }
                    aria-disabled={!invoice || !invoice.invoice_pdf}
                    tabIndex={!invoice || !invoice.invoice_pdf ? -1 : undefined}
                  >
                    View Invoice
                  </Link>
                  <DropdownMenuSeparator />
                  <Link
                    href={
                      !!invoice && !!invoice.hosted_invoice_url
                        ? invoice.hosted_invoice_url
                        : ""
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                    className={
                      !!invoice && !!invoice.hosted_invoice_url
                        ? ""
                        : "pointer-events-none"
                    }
                    aria-disabled={!invoice || !invoice.hosted_invoice_url}
                    tabIndex={
                      !invoice || !invoice.hosted_invoice_url ? -1 : undefined
                    }
                  >
                    Pay Invoice
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];

const InvoiceTable = ({ data }: { data: Invoice[] }) => {
  const handleExportRows = (rows: MRT_Row<Invoice>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) =>
      columns
        .filter((column) => column.accessorKey !== "actions")
        .map((column) => {
          if (column.accessorKey === "amount_remaining") {
            return balanceFormat(
              row.original.amount_remaining?.toString() || "0"
            );
          }
          if (column.accessorKey === "due_date") {
            return TimestampConverter(row.original.due_date);
          }
          return row.original[column.accessorKey as keyof Invoice];
        })
    );
    const tableHeaders = columns
      .map((c) => c.header)
      .filter((header) => header !== "Actions");

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("HRS-Customer.pdf");
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

export default InvoiceTable;
