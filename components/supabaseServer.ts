"use server";
import { Product } from "@/app/admin/dashboard/inventory/page";
import { Tables, TablesInsert } from "@/types_db";
import { createProduct, upsertJobRecord } from "@/utils/supabase/admin";
import React from "react";

type Job = TablesInsert<"jobs">;

export const supabaseServer = (job: Job) => {
  return upsertJobRecord(job);
};

export const supabaseProductCreate = (product: Product) => {
  return createProduct(product);
};
