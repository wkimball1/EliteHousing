"use server"
import { Tables } from '@/types_db';
import { upsertJobRecord } from '@/utils/supabase/admin';
import React from 'react'

type Job = Tables<"jobs">;

export const supabaseServer = (job: Job) => {
  return (
    upsertJobRecord(job)
  )
}
