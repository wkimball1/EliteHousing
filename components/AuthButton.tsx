import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4 text-foreground-muted user-select-none hover:bg-background focus:bg-background">
      <p className="text-sm pt-8 text-slate-600">Hey, {user.email}!</p>
      <form
        className="pt-8 user-select-none hover:bg-background focus:bg-background"
        action="/api/auth/signout"
        method="post"
      >
        <Button
          variant="default"
          className="bg-red-600 text-background hover:bg-red-500"
        >
          Logout
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/admin"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
