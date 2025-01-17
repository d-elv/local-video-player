"use client";

import { createClient } from "@/app/utils/supabase/client";
import { login } from "./actions";
import { redirect } from "next/navigation";
import { FormButton } from "../../components/ui/shared/FormButton";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useToast } from "@/app/hooks/use-toast";
import { EyeOff, Eye } from "lucide-react";

export default function LoginPage() {
  const initialState = { success: false, message: "" };
  const [response, loginAction, isPending] = useActionState(
    login,
    initialState
  );
  const { toast } = useToast();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const passwordType = passwordShown ? "text" : "password";

  useEffect(() => {
    async function redirectSignedInUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        redirect("/dashboard");
      }
    }
    redirectSignedInUser();
    if (emailRef.current !== null) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (response.success) {
      toast({
        title: "Login Successful",
        description: response.message,
      });
      redirect("/dashboard");
    } else if (response.success === false && response.message !== "") {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: response.message,
      });
    }
  }, [response, toast]);

  async function signInAnonymously() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInAnonymously();
    if (data.user?.email === "") {
      toast({
        title: "Anonymous Sign in Successful",
        description: "No video progress will be saved.",
      });
    }
    if (error !== null) {
      toast({
        title: "Anonymous Sign in Unsuccessful",
        description: "Please try again later, or signing up.",
      });
    }
    redirect("/dashboard");
  }

  return (
    <>
      <h1 className="text-red-600 text-center font-bold md:text-lg p-2">
        Supabase is currently experiencing capacity issues, which affects the
        signed in service of this app.
      </h1>
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center">
        <form
          className="flex flex-col place-content-center rounded-lg border-gray-700 webk border-2 p-4 bg-secondary w-96"
          key="login-form"
          action={loginAction}
        >
          <h1 className="flex self-center font-bold mb-4 text-2xl">Login</h1>
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            ref={emailRef}
            required
            className="bg-background text-primary-foreground font-sans rounded-md mt-1 p-1 pl-2 "
          />
          <label htmlFor="password" className="text-sm mt-2">
            Password
          </label>
          <div className="bg-background rounded-md flex items-center justify-between">
            <input
              id="password"
              name="password"
              type={passwordType}
              required
              className="bg-background text-primary-foreground w-full font-sans pl-2 p-1 rounded-md"
            />
            <button
              onClick={() => setPasswordShown(!passwordShown)}
              type="button"
              className="pr-2 w-fit"
            >
              {passwordShown ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div className="flex flex-row justify-between items-center mt-4">
            <FormButton type="submit" disabled={isPending}>
              Log in
            </FormButton>
            <p className="text-base mb-0">
              Not Signed Up?{" "}
              <Link href="/login/signup" className="italic">
                Click Here
              </Link>
            </p>
          </div>
          <p className="self-center font-bold text-lg mb-2">
            ---------- <span className="text-base font-normal">or</span>{" "}
            ----------
          </p>
          <FormButton type="button" onClick={signInAnonymously}>
            Sign In Anonymously
          </FormButton>
        </form>
      </div>
    </>
  );
}
