"use client";
import { createClient } from "@/utils/supabase/client";
import { permanentRedirect, redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import NavBar from "@/components/NavBar";
import { revalidatePath } from "next/cache";
import { login } from "./actions";
import { useEffect } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    async function checkLoggedIn() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // If user is already logged in, redirect to dashboard
        router.replace("/admin/dashboard/customers");
      }
    }

    checkLoggedIn();
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full">
      <NavBar />

      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md self-center justify-center gap-2">
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <Button formAction={login}>Log in</Button>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
