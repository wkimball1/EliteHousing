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
    <div className="flex items-center gap-4 text-foreground">
      <p className="text-sm">Hey, {user.email}!</p>
      <form action="/api/auth/signout" method="post">
        <Button variant="default">Logout</Button>
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
