// js/components/admin/usuarios.js
import { supabase, must } from '../../services/supabase.js';
import { can } from '../../core/permissions.js';

function tplRow(u) {
  return `
    <tr>
      <td>${u.full_name || '(sem nome)'}</td>
      <td>${u.tenant_role}</td>
      <td>${(u.sectors || []).join(', ')}</td>
      <td>${u.last_seen_at ? new Date(u.last_seen_at).toLocaleString() : '-'}</td>
      <td>
        ${can('user:promote') ? `<button data-act="promote" data-id="${u.user_id}">Promover</button>` : ''}
        ${can('user:remove') ? `<button data-act="remove" data-id="${u.user_id}">Remover</button>` : ''}
      </td>
    </tr>`;
}

export async function renderAdminUsuarios() {
  document.title = 'Admin · Usuários';
  const root = document.getElementById('app');
  root.innerHTML = `
    <section>
      <h2>Usuários</h2>
      <div>
        <input id="filtro" placeholder="Buscar...">
        <button id="btn-buscar">Buscar</button>
        ${can('user:add') ? `<button id="btn-add">Adicionar membro</button>` : ''}
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Papel</th><th>Setores</th><th>Último acesso</th><th>Ações</th></tr></thead>
        <tbody id="grid"></tbody>
      </table>
    </section>
  `;

  async function load(search = '', limit = 25, offset = 0) {
    const { data, error } = await supabase.rpc('users_list', {
      p_search: search, p_limit: limit, p_offset: offset
    });
    if (error) throw error;
    document.getElementById('grid').innerHTML = (data || []).map(tplRow).join('');
    wireActions();
  }

  function wireActions() {
    document.querySelectorAll('button[data-act]').forEach(btn => {
      btn.onclick = async () => {
        const userId = btn.dataset.id;
        const act = btn.dataset.act;

        if (act === 'promote') {
          const role = prompt('Novo papel (admin|manager|member|viewer):', 'manager');
          if (!role) return;
          const { error } = await supabase.rpc('tenant_update_member_role', {
            p_user_id: userId, p_role: role
          });
          if (error) return alert(error.message);
          load(document.getElementById('filtro').value);
        }

        if (act === 'remove') {
          if (!confirm('Remover do tenant?')) return;
          const { error } = await supabase.rpc('tenant_remove_member', {
            p_user_id: userId
          });
          if (error) return alert(error.message);
          load(document.getElementById('filtro').value);
        }
      };
    });

    const add = document.getElementById('btn-add');
    if (add) {
      add.onclick = async () => {
        const userId = prompt('Informe o user_id (uuid) já existente em profiles/auth.users:');
        const role = prompt('Papel (admin|manager|member|viewer):', 'member');
        if (!userId || !role) return;
        const { error } = await supabase.rpc('tenant_add_member', { p_user_id: userId, p_role: role });
        if (error) return alert(error.message);
        load(document.getElementById('filtro').value);
      };
    }
  }

  document.getElementById('btn-buscar').onclick = () => {
    load(document.getElementById('filtro').value);
  };

  await load('');
}
