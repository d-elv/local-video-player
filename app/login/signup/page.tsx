import { createClient } from "@/utils/supabase/server";
import { signUp } from "../actions";
import { redirect } from "next/navigation";
import { FormButton } from "../../ui/shared/FormButton";
import Link from "next/link";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center items-center">
      <form
        className="flex flex-col place-content-center rounded-lg border-gray-700 webk border-2 p-4 bg-secondary w-96"
        key="signup-form"
      >
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="bg-background-hover text-primary-foreground font-sans rounded-md mt-1 p-1 pl-2"
        />
        <label htmlFor="password" className="text-sm mt-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="bg-background-hover text-primary-foreground font-sans rounded-md p-1 pl-2"
        />
        <div className="flex flex-row justify-between items-center mt-4">
          <FormButton formAction={signUp}>Sign Up</FormButton>
          <p className="text-sm">
            Already signed up?{" "}
            <Link href="/login" className="italic">
              Click Here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
