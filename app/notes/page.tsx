import AuthButton from '@/components/AuthButton';
import NavBar from '@/components/NavBar';
import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();
  
  return(
    <div className='flex flex-col'>
      <NavBar>
        <AuthButton/>
      </NavBar>
      {/* <pre className='py-16 px-2 '>{JSON.stringify(notes, null, 2)}</pre> */}
    </div>)
}