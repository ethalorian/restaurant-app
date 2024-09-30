import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ShoppingCart } from "./shopping-cart";

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center justify-end space-x-2 text-sm sm:text-base">
      <span className="ml-8 truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-none">
        Hey, {user.email}!
      </span>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} size="sm" className="px-2 py-1 sm:px-3 sm:py-2 ml-2">
          Sign out
        </Button>
      </form>
      <div className="mr-2">
      <ShoppingCart  />
      </div>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <Button asChild size="sm" variant={"outline"} className="px-2 py-1 sm:px-3 sm:py-2">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"} className="px-2 py-1 sm:px-3 sm:py-2">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
