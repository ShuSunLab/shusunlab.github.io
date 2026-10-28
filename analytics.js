(() => {
  'use strict';
  const config = window.SSG_CONFIG || {};
  const httpsUrl = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash ? url : null;
    } catch { return null; }
  };
  const endpoint = httpsUrl(config.analyticsEndpoint);
  const ready = endpoint?.pathname === '/api/events';
  const dashboard = httpsUrl(config.analyticsDashboardUrl);
  if (dashboard) document.querySelectorAll('[data-analytics-dashboard]').forEach(link => {
    link.href = dashboard.href;
    link.hidden = false;
  });
  const privacySignal = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  const blocked = () => {
    try { return privacySignal() || localStorage.getItem('ssg-analytics-off') === '1'; }
    catch { return true; }
  };
  const toggle = document.querySelector('#tracking-toggle');
  const status = document.querySelector('#tracking-status');
  const paint = () => {
    if (!toggle || !status) return;
    toggle.disabled = !ready || privacySignal();
    toggle.textContent = !ready ? 'Analytics not connected' : privacySignal() ? 'Privacy signal respected' : blocked() ? 'Enable optional analytics' : 'Disable optional analytics';
    status.textContent = !ready ? 'Optional research analytics are not configured for this deployment.' : blocked() ? 'Optional research analytics are off in this browser.' : 'Optional analytics are enabled. Delivery depends on the connected service and your network.';
  };
  paint();
  if (!ready) return;
  const raw = location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  const page = '/' + (raw.endsWith('.html') ? raw : raw + '.html');
  if (!['/index.html','/platforms.html','/datasets.html','/publications.html','/tutorials.html','/privacy.html'].includes(page)) return;
  let session;
  function send(kind, resource) {
    if (blocked()) return false;
    try {
      if (!session) {
        session = sessionStorage.getItem('ssg-session') || crypto.randomUUID();
        sessionStorage.setItem('ssg-session', session);
      }
      const body = JSON.stringify({id: crypto.randomUUID(), kind, resource, page, session});
      void fetch(endpoint.href, {method:'POST', mode:'cors', credentials:'omit', referrerPolicy:'no-referrer', headers:{'Content-Type':'application/json'}, body, keepalive:true}).catch(() => {});
      return true;
    } catch { return false; }
  }
  let viewed = false;
  function view() {
    if (!viewed && document.visibilityState === 'visible') viewed = send('page_view', 'site');
  }
  document.addEventListener('visibilitychange', view);
  view();
  toggle?.addEventListener('click', () => {
    try { localStorage.setItem('ssg-analytics-off', blocked() ? '0' : '1'); paint(); view(); }
    catch { status.textContent = 'This browser does not allow the preference to be saved.'; }
  });
  const pairs = {dataset_access_click:['panolamp','rt-datasets'], dataset_download_click:['panolamp','rt-datasets'], software_download_click:['holochantwin'], platform_repository_click:['holochantwin'], platform_launch_click:['holochantwin']};
  document.addEventListener('click', event => {
    const a = event.target.closest?.('a');
    if (!a) return;
    if (pairs[a.dataset.event]?.includes(a.dataset.resource)) {send(a.dataset.event, a.dataset.resource);return;}
    try {
      const url = new URL(a.href);
      if (url.hostname === 'github.com' && url.pathname === '/ShuSunLab/PanoLAMP' && url.hash === '#download') send('dataset_access_click', 'panolamp');
      if (url.hostname === 'github.com' && url.pathname === '/ShuSunLab/HoloChanTwin') send('platform_repository_click', 'holochantwin');
    } catch {}
  });
})();
