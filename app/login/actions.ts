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

type Login = {
  success: boolean;
  message: string;
};

export async function login(prevState: Login, formData: FormData) {
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
    return { success: false, message: "Missing Fields. Failed to login" };
  }

  const { email, password } = validatedFields.data;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Data: ", data);
  console.log("Error: ", error);

  if (error) {
    // return "Failed";
    return { success: false, message: `${error.code}` };
    // redirect("/error");
  }
  // return "Success";
  return {
    success: true,
    message: `Login successful, welcome ${data.user.email}`,
  };
  // revalidatePath("/dashboard", "layout");
  // redirect("/dashboard");
}

export async function signUp(formData: FormData) {
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
  const { data, error } = await supabase.auth.signUp({ email, password });

  console.log("Data", data);
  console.log("Error", error);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login/confirm");
}
