import AuthButton from "@/components/AuthButton";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  return (
    <div className="flex flex-col w-full h-screen bg-background">
      <div className="w-full sticky top-0 left-0">
        <NavBar />
      </div>
      <div className="flex flex-col w-full flex-1 bg-background items-center justify-start gap-8 pt-10 pb-4 md:pt-14 md:pb-6 px-4">
        <div>
          <h1 className="font-bold text-lg md:text-3xl">
            Welcome to Home Renovation Systems
          </h1>
        </div>
      </div>
    </div>
  );
}
