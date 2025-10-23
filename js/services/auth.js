// js/services/auth.js
import { supabase, must } from './supabase.js';

export async function signInWithEmail(email) {
  // OTP por e-mail (pode trocar por OAuth Google/MS)
  return must(await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }));
}

export async function signOut() {
  await supabase.auth.signOut();
  location.href = '/login';
}

export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_event, session) => cb(session));
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// valida acesso ao tenant “pelo host” chamando algo que depende de RLS
export async function assertTenantAccess() {
  const { error, data } = await supabase.rpc('dashboard_counts');
  if (error) throw error;
  if (!data) throw new Error('Sem acesso ao tenant deste host.');
  return data;
}
