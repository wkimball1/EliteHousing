import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";

export default async function Index() {
  const canInitSupabaseClient = () => {
      createClient();
      return true;

  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      {isSupabaseConnected ? <h1>Welcome to Elite Housing</h1> : <h1>issues</h1>}
    </div>
  );
}
