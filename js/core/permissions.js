// js/core/permissions.js
import { supabase, must } from '../services/supabase.js';

const cache = { role: null, sectors: [] };

export async function loadTenantRole() {
  // pega teu papel no tenant atual
  const { data, error } = await supabase
    .from('memberships')
    .select('role')
    .limit(1);
  if (error) throw error;
  cache.role = data?.[0]?.role ?? null;
  return cache.role;
}

export function can(action) {
  const r = cache.role;
  if (!r) return false;

  // regras diretas
  if (r === 'admin') return true;
  if (r === 'manager') return !['tenant:domain:deletePrimary'].includes(action);
  if (r === 'member')  return ['task:create','event:comment','sector:view','user:view'].includes(action);
  if (r === 'viewer')  return action.endsWith(':view');
  return false;
}

export function role() { return cache.role; }
