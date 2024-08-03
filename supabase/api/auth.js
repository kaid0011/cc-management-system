import { supabase } from "../config.js";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, website, avatar_url")
    .eq("id", userId)
    .single();

  return { data, error };
}

export async function updateProfileData(updates) {
  const { error } = await supabase.from("profiles").upsert(updates);
  return { error };
}

export function signOutUser() {
  supabase.auth.signOut();
}

export async function signInWithOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  return { error };
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signUpNewUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  return { data, error };
}

// export async function signInWithEmail(email, password, system_access) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: email,
//     password: password,
//   });
//   return { data, error };
// }

export async function signInWithEmail(email, password, system_access) {
  // Check if the email exists in the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, system_access')
    .eq('email', email)
    .single();

  // Handle error or if the email does not exist in profiles
  if (profileError || !profileData) {
    return { data: null, error: 'Email not found in profiles or could not be retrieved' };
  }

  // Check if system_access matches
  if (profileData.system_access !== system_access) {
    return { data: null, error: 'System access level mismatch' };
  }

  // Proceed with authentication if email and system_access are verified
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  // Return authentication result
  return { data: authData, error: authError };
}