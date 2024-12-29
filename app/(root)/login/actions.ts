"use server";

import { createClient } from "@/app/utils/supabase/server";
import { z } from "zod";

const LoginFormSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(5, { message: "Email must be 5 or more characters long." }),
    password: z
      .string()
      .min(6, { message: "Password must be 6 or more characters long." }),
  })
  .required();

const SignupFormSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(5, { message: "Email must be 5 or more characters long." }),
    password: z
      .string()
      .min(6, { message: "Password must be 6 or more characters long." }),
    confirm: z.string().min(6, {
      message: "Confirm password must be 6 or more characters long.",
    }),
  })
  .required()
  .refine((fields) => fields.password === fields.confirm, {
    message: `Password and Confirm fields must match`,
    path: ["confirm"],
  });

type Response = {
  success: boolean;
  message: string;
};

export async function login(prevState: Response, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = LoginFormSchema.safeParse({
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
    return { success: false, message: `${error.code}` };
  }
  return {
    success: true,
    message: `Login successful, welcome ${data.user.email}`,
  };
}

export async function signUp(prevState: Response, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  console.log(
    SignupFormSchema.safeParse({
      email: "delvey21@hotmail.co.uk",
      password: "elveys1",
      confirm: "elveys1",
    }),
    SignupFormSchema.safeParse({
      email: "delvey21@hotmail.co.uk",
      password: "elveys1",
      confirm: "elveys1",
    }).error?.errors
  );

  if (!validatedFields.success) {
    if (validatedFields.error.flatten().fieldErrors.email) {
      return {
        success: false,
        message: `${validatedFields.error.flatten().fieldErrors.email}`,
      };
    } else if (validatedFields.error.flatten().fieldErrors.password) {
      return {
        success: false,
        message: `${validatedFields.error.flatten().fieldErrors.password}`,
      };
    } else if (validatedFields.error.flatten().fieldErrors.confirm) {
      return {
        success: false,
        message: `${validatedFields.error.flatten().fieldErrors.confirm}`,
      };
    } else if (validatedFields.error.flatten().formErrors) {
      return {
        success: false,
        message: `${validatedFields.error.flatten().formErrors}`,
      };
    } else {
      return {
        success: false,
        message: "Missing Fields. Failed to sign up.",
      };
    }
  }

  const { email, password } = validatedFields.data;
  const { data, error } = await supabase.auth.signUp({ email, password });

  console.log("Data", data);
  console.log("Error", error);

  if (error) {
    return { success: false, message: `${error.code}` };
  }

  return {
    success: true,
    message: `Confirmation email sent, go click the link!`,
  };
}
