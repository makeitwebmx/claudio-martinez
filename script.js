/* CV WEB v2 — Claudio Martínez Meza */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* Menú móvil */
  const burger = $('#burger'), menu = $('#menu');
  if (burger && menu) {
    const close = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* Niveles → variable CSS + puntos de idiomas */
  $$('[data-level]').forEach(el => {
    el.style.setProperty('--level', el.dataset.level + '%');
    const dots = $('.lg-dots', el);
    if (dots) {
      const on = Math.round(Number(el.dataset.level) / 10);
      dots.innerHTML = Array.from({ length: 10 }, (_, i) => `<i class="${i < on ? 'on' : ''}"></i>`).join('');
    }
  });

  /* Reveal en scroll (secciones, tarjetas y sidebar) */
  const targets = [...$$('.sec'), ...$$('.side-block'), ...$$('.tl-item'), ...$$('.card'), ...$$('.tool'), ...$$('.edu-item')];
  targets.forEach(t => t.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    targets.forEach(t => io.observe(t));
  } else { targets.forEach(t => t.classList.add('is-visible')); }

  /* Enlace activo */
  const secs = $$('.sec[id]');
  const links = $$('#menu a');
  const setActive = id => links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  if ('IntersectionObserver' in window && secs.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(s => spy.observe(s));
  }

  /* Copiar correo */
  const toast = $('#toast'); let t;
  const say = msg => { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); clearTimeout(t); t = setTimeout(() => toast.classList.remove('show'), 1800); };
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(b.dataset.copy);
      else { const ta = document.createElement('textarea'); ta.value = b.dataset.copy; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
      say('Correo copiado');
    } catch (_) { say('No se pudo copiar'); }
  }));

  /* PDF */
  const pb = $('#printBtn'); if (pb) pb.addEventListener('click', () => window.print());

  /* Año */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
