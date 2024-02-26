import React from 'react'
import CustomerPortalForm from '@/components/ui/CustomerPortalForm'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default function CustomersPage() {
  return (
    <div><CustomerPortalForm subscription={null} /></div>
  )
}
