// js/components/comuns/sidebar.js
export function renderSidebar() {
  const el = document.getElementById('sidebar');
  if (!el) return;
  el.innerHTML = `
    <nav>
      <a href="#/">Início</a>
      <a href="#/admin/usuarios">Admin · Usuários</a>
      <a href="#/setor/financeiro">Financeiro</a>
      <a href="#/setor/analista">Analista</a>
    </nav>
  `;
}
