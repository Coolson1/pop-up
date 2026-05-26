import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const authClient = createClient(url, anonKey);

export async function signUp(email: string, password: string) {
  return await authClient.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  return await authClient.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await authClient.auth.signOut();
}

export async function getSession() {
  return await authClient.auth.getSession();
}

export async function getUser() {
  return await authClient.auth.getUser();
}

export async function isAdmin(userId: string, email: string) {
  const { data } = await createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!).from("admins").select("id").eq("user_id", userId).eq("email", email).maybeSingle();
  return !!data;
}
