import AuthButton from "@/components/AuthButton";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/server";

export default async function Notes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <div className="flex flex-col">
      <h1>Notes</h1>
    </div>
  );
}
