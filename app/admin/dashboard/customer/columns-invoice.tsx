"use client";

import * as React from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tables, Json } from "@/types_db";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { createStripePortal } from "@/utils/stripe/server";
import handleStripePortalRequest from "@/components/handle-stripe-portal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Stripe from "stripe";
import { balanceFormat } from "./[id]/page";

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
      return "bg-slate-200";
    case "open":
      return "bg-slate-50";
    case "paid":
      return "bg-green-500";
    case "uncollectable":
      return "bg-red-400";
    case "void":
      return "bg-stone-400";
    default:
      return "bg-background";
  }
};

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "amount_due",
    header: "Amount",
    cell: ({ row }) => (
      <div className="capitalize">
        {balanceFormat(row.getValue("amount_due"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div>
          <Button
            variant="outline"
            className={`capitalize ${getColorClass(row.getValue("status"))}`}
          >
            {row.getValue("status")}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Invoice Number",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {!!row.getValue("due_date")
          ? TimestampConverter(row.getValue("due_date"))
          : "none"}
      </div>
    ),
  },
  {
    accessorKey: "billing_address",
    header: () => <div className="text-right">Address</div>,
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("billing_address")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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
            <Button variant="default" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
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
                router.push(
                  "/admin/dashboard/customer?" +
                    createQueryString("customerId", customer.id)
                )
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
