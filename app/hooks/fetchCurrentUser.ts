import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export async function fetchCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();

  if (data.session && data.session.user.email) {
    return data.session.user;
  }
  return null;
}
