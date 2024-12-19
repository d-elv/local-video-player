"use client";

import { createClient } from "@/utils/supabase/client";
import { signUp } from "../actions";
import { redirect } from "next/navigation";
import { FormButton } from "../../ui/shared/FormButton";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const initialState = { success: false, message: "" };
  const [response, signupAction, isPending] = useActionState(
    signUp,
    initialState
  );
  const { toast } = useToast();
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log("password:", password);
    console.log("confirm:", confirm);
    if (response.success) {
      toast({
        title: "Signup successful",
        description: response.message,
      });
      redirect("/login/confirm");
    } else if (response.success === false && response.message !== "") {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: response.message,
      });
    }
  }, [response]);

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
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

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
          ref={emailRef}
          required
          className="bg-background text-primary-foreground font-sans rounded-md mt-1 p-1 pl-2"
        />
        <label htmlFor="password" className="text-sm mt-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
          min={6}
          required
          className="bg-background text-primary-foreground font-sans rounded-md p-1 pl-2"
        />
        <label htmlFor="password" className="text-sm mt-2">
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          onChange={(event) => {
            setConfirm(event.target.value);
          }}
          value={confirm}
          min={6}
          required
          className="bg-background text-primary-foreground font-sans rounded-md p-1 pl-2"
        />
        <div className="flex flex-row justify-between items-center mt-4">
          <FormButton formAction={signupAction} disabled={isPending}>
            Sign Up
          </FormButton>
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
