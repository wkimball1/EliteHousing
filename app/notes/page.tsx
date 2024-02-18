'use client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Note() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const [userData, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter();



    

  useEffect(() => {

      
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
      setLoading(false)
      
    }

    getData()

  }, [])

  

  
  if (loading){
    return <h1>loading...</h1>
  }
  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}