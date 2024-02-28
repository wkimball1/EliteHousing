import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import  {Button}  from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import NavBar from "@/components/NavBar";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/admin?message=Could not authenticate user");
    }

    return redirect("/admin/dashboard");
  };


  return (
    <div className="flex-1 flex flex-col w-full">
      <NavBar>
         <AuthButton/>
      </NavBar>
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md self-center justify-center gap-2">
      
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signIn}
      >
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
        <Button className="px-4 py-2 font-sans text-xs font-bold text-center text-foreground uppercase align-middle transition-all rounded-lg select-none hover:bg-background/10 active:bg-background/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none sm:inline-block">
          Sign In
        </Button>
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
