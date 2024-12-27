"use client";

import { createClient } from "@/utils/supabase/client";
import { signUp } from "../actions";
import { redirect } from "next/navigation";
import { FormButton } from "../../ui/shared/FormButton";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EyeOff, Eye } from "lucide-react";

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
  const [passwordShown, setPasswordShown] = useState(false);
  const passwordType = passwordShown ? "text" : "password";
  const [confirmShown, setConfirmShown] = useState(false);
  const confirmType = confirmShown ? "text" : "password";
  const [showMatchError, setShowMatchError] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    setTimeout(() => {
      if (password !== confirm) {
        setShowMatchError(true);
      } else {
        setShowMatchError(false);
      }
    }, 1000);
  }, [password, confirm]);

  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex justify-center items-center flex-col">
      <form
        className="flex flex-col place-content-center rounded-lg border-gray-700 webk border-2 p-4 bg-secondary w-96 z-50"
        key="signup-form"
      >
        <h1 className="flex self-center font-bold mb-4 text-2xl">Signup</h1>
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
        <div className="bg-background rounded-md flex items-center justify-between">
          <input
            id="password"
            name="password"
            type={passwordType}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            min={6}
            required
            className="bg-background text-primary-foreground w-full font-sans p-1 pl-2 rounded-md"
          />
          <button
            onClick={() => setPasswordShown(!passwordShown)}
            type="button"
            className="pr-2 w-fit"
          >
            {passwordShown ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <label htmlFor="password" className="text-sm mt-2">
          Confirm Password
        </label>
        <div className="bg-background rounded-md flex items-center justify-between">
          <input
            id="confirm"
            name="confirm"
            type={confirmType}
            onChange={(event) => {
              setConfirm(event.target.value);
            }}
            value={confirm}
            min={6}
            required
            className="bg-background text-primary-foreground w-full font-sans rounded-md p-1 pl-2"
          />
          <button
            onClick={() => setConfirmShown(!confirmShown)}
            type="button"
            className="pr-2 w-fit"
          >
            {confirmShown ? <Eye /> : <EyeOff />}
          </button>
        </div>

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
      <p
        className={`text-red-700 mt-1 text-sm self-start absolute top-60 z-0 transition-all ease-in-out duration-300 ${
          showMatchError
            ? "opacity-100 translate-y-8"
            : "opacity-0 translate-y-0"
        }`}
      >
        Passwords must match
      </p>
    </div>
  );
}
