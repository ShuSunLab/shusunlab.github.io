(() => {
  'use strict';
  const counters = [...document.querySelectorAll('[data-public-stat]')];
  const status = document.querySelector('[data-stats-status]');
  if (!counters.length || !status) return;
  const unavailable = () => {
    counters.forEach(node => { node.textContent = '—'; });
    status.textContent = 'Statistics temporarily unavailable.';
  };
  let endpoint;
  try {
    const collector = new URL(window.SSG_CONFIG?.analyticsEndpoint);
    if (collector.protocol !== 'https:' || collector.username || collector.password || collector.pathname !== '/api/events') throw new Error();
    endpoint = new URL('/api/public-stats', collector.origin);
  } catch { unavailable(); return; }
  const raw = location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  const page = '/' + (raw.endsWith('.html') ? raw : raw + '.html');
  const count = value => Number.isSafeInteger(value) && value >= 0;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  fetch(endpoint.href, {mode:'cors', credentials:'omit', referrerPolicy:'no-referrer', signal:controller.signal})
    .then(response => { if (!response.ok) throw new Error(); return response.json(); })
    .then(data => {
      if (data.version !== 1) throw new Error();
      const values = {
        siteViews: data.totals?.pageViews,
        pageViews: data.pages?.[page],
        datasetClicks: data.totals?.datasetDownloadClicks,
        panolampClicks: data.resources?.panolamp?.downloadClicks,
        softwareClicks: data.resources?.holochantwin?.repositoryClicks
      };
      if (!counters.every(node => count(values[node.dataset.publicStat]))) throw new Error();
      counters.forEach(node => { node.textContent = values[node.dataset.publicStat].toLocaleString('en-US'); });
      status.textContent = /^\d{4}-\d{2}-\d{2}$/.test(data.since)
        ? `Recorded since ${data.since} · Updates may take a few minutes.`
        : 'No recorded activity yet · Updates may take a few minutes.';
    }).catch(unavailable).finally(() => clearTimeout(timeout));
})();
