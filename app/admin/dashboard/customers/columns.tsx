"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Tables, Json } from '@/types_db';

type Customer = Tables<'customers'>;


export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
]
