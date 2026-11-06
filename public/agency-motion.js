/* Progressive enhancement: no scroll hijacking, cursor replacement or stored tracking. */
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const toggles = [...document.querySelectorAll('[data-motion-toggle]')];
  let paused = reduced.matches;
  let frame = 0;
  const tilts = [...document.querySelectorAll('[data-tilt]')];
  const reset = () => tilts.forEach(el => { el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg'); });
  const apply = () => {
    root.dataset.motion = paused || reduced.matches ? 'paused' : 'running';
    toggles.forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(paused || reduced.matches));
      button.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
      button.disabled = reduced.matches;
    });
    if (paused || reduced.matches) { cancelAnimationFrame(frame); frame=0; reset(); }
  };
  toggles.forEach(button => button.addEventListener('click', () => { paused=!paused; apply(); }));
  reduced.addEventListener('change', () => { paused=reduced.matches; apply(); });
  pointer.addEventListener('change', reset);
  apply();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve?.(entry.target); }
    }), {threshold:0.08});
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }
  tilts.forEach(el => {
    el.addEventListener('pointermove', event => {
      if (paused || reduced.matches || !pointer.matches || event.pointerType==='touch' || document.hidden) return;
      const box=el.getBoundingClientRect();
      const x=(event.clientX-box.left)/box.width-.5, y=(event.clientY-box.top)/box.height-.5;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(() => { el.style.setProperty('--rx', `${-y*7}deg`); el.style.setProperty('--ry', `${x*9}deg`); frame=0; });
    }, {passive:true});
    el.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); frame=0; reset(); });
  });
  document.addEventListener('visibilitychange', () => {
    root.dataset.visibility=document.hidden?'hidden':'visible';
    if(document.hidden){ cancelAnimationFrame(frame); frame=0; reset(); }
  });
  const hero=document.querySelector('[data-world]');
  const worldButtons=[...document.querySelectorAll('[data-world-select]')];
  worldButtons.forEach(button => button.addEventListener('click', () => {
    const world=button.dataset.worldSelect;
    if(!hero || !['websites','audits'].includes(world)) return;
    hero.dataset.world=world;
    worldButtons.forEach(other => other.setAttribute('aria-pressed', String(other===button)));
    document.querySelectorAll('[data-world-panel]').forEach(panel => panel.hidden=panel.dataset.worldPanel!==world);
    const status=document.querySelector('[data-world-status]');
    if(status) status.textContent=world==='audits'?'AI-app security reviews: coming soon. Illustrative report structure, not a completed audit.':'Website design concept selected.';
  }));
  document.querySelectorAll('[data-dialog-open]').forEach(button => {
    const dialog=document.getElementById(button.dataset.dialogOpen);
    if(!dialog || typeof dialog.showModal!=='function') return;
    button.hidden=false;
    button.addEventListener('click', () => { if(!dialog.open){ dialog.showModal(); document.body.classList.add('detail-open'); } });
    dialog.addEventListener('close', () => { document.body.classList.remove('detail-open'); button.focus(); });
    dialog.addEventListener('click', event => { const b=dialog.getBoundingClientRect(); if(event.target===dialog && (event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)) dialog.close(); });
  });
})();
