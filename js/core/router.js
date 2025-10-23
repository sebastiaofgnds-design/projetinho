// js/core/router.js
import { getSession, onAuthChange, assertTenantAccess } from '../services/auth.js';
import { pageview } from './telemetry.js';

const routes = new Map(); // { '#/admin/usuarios': renderFn }

export function register(path, render) { routes.set(path, render); }

async function guardAndRender(path) {
  const session = await getSession();
  if (!session) { location.hash = '#/login'; return; }

  // valida RLS/tenant host
  try { await assertTenantAccess(); }
  catch {
    document.body.innerHTML = '<h3>Acesso negado ao tenant deste domínio.</h3>';
    return;
  }

  const render = routes.get(path) || routes.get('#/notfound');
  if (render) {
    await render();
    pageview(location.hash || '/'); // loga navegação
  }
}

export function startRouter() {
  window.addEventListener('hashchange', () => guardAndRender(location.hash || '#/'));
  onAuthChange(() => guardAndRender(location.hash || '#/'));
  guardAndRender(location.hash || '#/');
}
