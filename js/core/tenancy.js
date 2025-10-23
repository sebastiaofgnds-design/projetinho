// js/core/tenancy.js
const state = {
  host: window.location.host,   // ex: xyz.ara.vela.com.br
  tenantSlug: null,             // opcional: se quiser extrair 'xyz'
};

(function derive() {
  // slug = primeira parte do host (antes do primeiro ".")
  state.tenantSlug = state.host.split('.')[0] || null;
})();

export const tenancy = {
  host() { return state.host; },
  slug() { return state.tenantSlug; }
};
