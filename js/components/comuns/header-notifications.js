// js/components/comuns/header-notifications.js
import { supabase } from '../../services/supabase.js';

export async function renderHeaderNotifications() {
  const el = document.getElementById('header-notifications');
  if (!el) return;

  // placeholder simples (integração real quando tiver tabela de notifications)
  el.innerHTML = `<button id="btn-refresh">🔔</button>`;
  document.getElementById('btn-refresh').onclick = async () => {
    // Exemplo: puxar contadores do dashboard só pra indicar atividade
    const { data, error } = await supabase.rpc('dashboard_counts');
    if (error) return alert('Erro ao carregar status');
    alert(`Usuários: ${data.total_users} · Setores: ${data.total_sectors}`);
  };
}
