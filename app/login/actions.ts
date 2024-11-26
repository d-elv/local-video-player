"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .email()
    .min(5, { message: "Email must be 5 or more characters long." }),
  password: z
    .string()
    .min(6, { message: "Password must be 6 or more characters long." }),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  const validatedFields = FormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    console.log(
      validatedFields.error.flatten().fieldErrors,
      "Missing Fields. Failed to login."
    );
    return;
  }

  const { email, password } = validatedFields.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const validatedFields = FormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    console.log(
      validatedFields.error.flatten().fieldErrors,
      "Missing Fields. Failed to sign up."
    );
    return;
  }

  const { email, password } = validatedFields.data;
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}
