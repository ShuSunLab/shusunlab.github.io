(() => {
  'use strict';
  const video = document.querySelector('#research-video-player');
  const toggle = document.querySelector('#research-video-toggle');
  const status = document.querySelector('#research-video-status');
  if (!video || !toggle || !status) return;
  toggle.hidden = false;
  const paint = () => { toggle.textContent = video.paused ? 'Play video' : 'Pause video'; };
  const failed = () => { status.textContent = 'The video could not be loaded. Please try again or use the download link.'; paint(); };
  toggle.addEventListener('click', async () => {
    if (!video.paused) { video.pause(); return; }
    status.textContent = '';
    try { await video.play(); } catch { failed(); }
  });
  video.addEventListener('playing', () => { status.textContent = ''; paint(); });
  video.addEventListener('pause', paint);
  video.addEventListener('ended', paint);
  video.addEventListener('error', failed);
  video.querySelector('source')?.addEventListener('error', failed);
})();
