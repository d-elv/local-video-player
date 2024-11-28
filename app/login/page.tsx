import { createClient } from "@/utils/supabase/server";
import { login, signUp } from "./actions";
import { redirect } from "next/navigation";

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
      <form className="flex flex-col place-content-center rounded-lg border-gray-700 webk border-2 p-4 bg-secondary w-96">
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="text-black font-sans rounded-md mt-1 p-1 pl-2 "
        />
        <label htmlFor="password" className="text-sm mt-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="text-black font-sans rounded-md p-1 pl-2"
        />
        <div className="flex flex-row justify-around mt-4">
          <button
            formAction={login}
            className="rounded-lg bg-primary hover:bg-primary-foreground pl-4 pr-4 pt-1 pb-1 transition-colors"
          >
            Log in
          </button>
          <button
            formAction={signUp}
            className="rounded-lg bg-primary hover:bg-primary-foreground pl-4 pr-4 pt-1 pb-1 transition-colors"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
