'use strict';
(() => {
  const button=document.querySelector('.menu-toggle');
  const menu=document.querySelector('#site-menu');
  function closeMenu(){menu.classList.remove('open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation menu');}
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';menu.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');});
  document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!button.contains(event.target))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){closeMenu();button.focus();}});
  menu.addEventListener('focusout',event=>{if(event.relatedTarget&&!menu.contains(event.relatedTarget)&&event.relatedTarget!==button)closeMenu();});
  const copy=document.querySelector('#copy-citation');
  if(copy)copy.addEventListener('click',async()=>{const text=document.querySelector('#citation-text').textContent;const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(text);copy.textContent='Copied ✓';status.textContent='BibTeX copied to your clipboard.';}catch{status.textContent='Clipboard access is unavailable. Select and copy the BibTeX text above.';}});
})();
