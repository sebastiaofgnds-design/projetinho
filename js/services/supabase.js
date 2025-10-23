// js/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// ⚠️ Troque pelos valores do seu projeto
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

// Enviamos o host do app para o PostgREST (RLS usa esse header)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    headers: { 'x-tenant-host': window.location.host }
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// utilzinho pra lidar com erros
export function must(ok) {
  if (ok.error) throw ok.error;
  return ok.data ?? ok;
}
