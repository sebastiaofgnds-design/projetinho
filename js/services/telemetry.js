// js/core/telemetry.js
import { supabase } from '../services/supabase.js';

export async function pageview(pathname) {
  // ignora erros (telemetria não deve travar UI)
  await supabase.rpc('pageview', { p_path: pathname }).catch(() => {});
}
