'use server';
import { Tables, TablesInsert } from '@/types_db';
import { upsertJobRecord } from '@/utils/supabase/admin';
import React from 'react';

type Job = TablesInsert<'jobs'>;

export const supabaseServer = (job: Job) => {
  return upsertJobRecord(job);
};
