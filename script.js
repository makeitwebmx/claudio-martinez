/* CV web v3 — Claudio Martínez Meza */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var NOFX = /[?&]nofx/.test(location.search) || window.matchMedia('print').matches;
  if (NOFX) document.documentElement.classList.add('nofx');

  /* año */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* menú móvil */
  var burger = $('#burger'), menu = $('#menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open'); burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* barras de nivel */
  $$('.skills li').forEach(function (li) {
    li.style.setProperty('--w', (li.getAttribute('data-level') || 0) + '%');
  });

  /* puntos de idioma */
  $$('.langs li').forEach(function (li) {
    var n = parseInt(li.getAttribute('data-level') || '0', 10), box = $('.dots', li);
    if (!box) return;
    for (var i = 1; i <= 10; i++) {
      var d = document.createElement('i'); if (i <= n) d.className = 'on'; box.appendChild(d);
    }
  });

  /* reveal + contadores + barras */
  var revealTargets = $$('.sec, .stats, .trusted, .cta, .services-grid li, .exp-item');
  revealTargets.forEach(function (el) { el.classList.add('rv'); });

  var counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    $$('[data-count]').forEach(function (el) {
      if (NOFX) { el.textContent = el.getAttribute('data-count'); return; }
      var end = parseInt(el.getAttribute('data-count'), 10), start = 0, t0 = null, dur = 900;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if (!NOFX && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.classList.contains('stats')) runCounters();
        $$('.skills li', e.target).forEach(function (li) { li.classList.add('is-in'); });
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    $$('.skills li').forEach(function (li) { li.classList.add('is-in'); });
    runCounters();
  }

  /* enlace activo del menú */
  var links = $$('.menu a'), secs = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  function setActive() {
    var pos = window.scrollY + 120, cur = null;
    secs.forEach(function (s) { if (s.offsetTop <= pos) cur = s; });
    links.forEach(function (a) { a.classList.toggle('is-active', cur && a.getAttribute('href') === '#' + cur.id); });
  }
  window.addEventListener('scroll', setActive, { passive: true }); setActive();

  /* copiar correo */
  var toast = $('#toast'), tt;
  function showToast(msg) {
    if (!toast) return; toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(function () { showToast('Correo copiado'); }, function () { showToast(v); });
      } else { showToast(v); }
    });
  });

  window.addEventListener('beforeprint', function () { $$('.skills li').forEach(function (li) { li.classList.add('is-in'); }); });


  /* ================= PORTAFOLIO ================= */
  var DATA = window.PORTAFOLIO || [];
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function metaStr(it){ var a=[]; if(it.brand) a.push('<b>'+esc(it.brand)+'</b>'); a.push(esc(it.catName)); return a.join('<span aria-hidden="true"> · </span>'); }

  /* destacados (PRINCIPALES) */
  var featBox = $('#featured');
  var feats = DATA.filter(function(d){ return d.featured; });
  if (featBox) {
    featBox.innerHTML = feats.map(function(it){
      return '<button type="button" class="tile" data-slug="'+it.slug+'" aria-label="Reproducir '+esc(it.title)+'">' +
        '<img src="'+it.poster+'" alt="" loading="lazy">' +
        '<span class="tile-tag">Principal</span><span class="tile-dur">'+it.dur+'</span>' +
        '<span class="tile-body"><span><h3>'+esc(it.title)+'</h3><span class="tile-meta">'+metaStr(it)+'</span></span><span class="tile-play">'+PLAY+'</span></span>' +
        '</button>';
    }).join('');
  }

  /* carrusel de destacados */
  var fp = $('#featPrev'), fn = $('#featNext');
  function featStep(){ var t = $('.tile', featBox); return t ? t.getBoundingClientRect().width + 22 : 400; }
  if (fp && featBox) fp.addEventListener('click', function(){ featBox.scrollBy({left:-featStep(), behavior:'smooth'}); });
  if (fn && featBox) fn.addEventListener('click', function(){ featBox.scrollBy({left: featStep(), behavior:'smooth'}); });

  /* rejilla completa con filtros */
  var grid = $('#portGrid'), filtersBox = $('#filters'), moreBtn = $('#moreBtn'), countEl = $('#portCount');
  var PAGE = 12, shown = PAGE, activeCat = 'all';
  var cats = [];
  DATA.forEach(function(d){ var c = cats.filter(function(x){ return x.key===d.cat; })[0]; if(!c){ c={key:d.cat,name:d.catName,n:0}; cats.push(c);} c.n++; });
  if (countEl) countEl.textContent = DATA.length;
  if (grid) {
    grid.innerHTML = DATA.map(function(it){
      return '<button type="button" class="card'+(it.vertical?'':' is-wide')+'" data-slug="'+it.slug+'" data-cat="'+it.cat+'" aria-label="Reproducir '+esc(it.title)+'">' +
        '<img src="'+it.poster+'" alt="" loading="lazy"><span class="card-dur">'+it.dur+'</span><span class="card-play">'+PLAY+'</span>' +
        '<span class="card-body"><h3>'+esc(it.title)+'</h3><span class="card-meta">'+metaStr(it)+'</span></span></button>';
    }).join('');
  }
  if (filtersBox) {
    filtersBox.innerHTML = '<button type="button" class="chip is-on" data-cat="all" role="tab" aria-selected="true">Todos<b>'+DATA.length+'</b></button>' +
      cats.map(function(c){ return '<button type="button" class="chip" data-cat="'+c.key+'" role="tab" aria-selected="false">'+esc(c.name)+'<b>'+c.n+'</b></button>'; }).join('');
  }
  function applyGrid(){
    var cards = $$('.card', grid), i = 0;
    cards.forEach(function(c){
      var match = activeCat==='all' || c.getAttribute('data-cat')===activeCat;
      var vis = match && i < shown; if (match) i++;
      c.classList.toggle('is-hidden', !vis);
    });
    if (moreBtn) moreBtn.parentNode.hidden = !(i > shown);
  }
  if (filtersBox) filtersBox.addEventListener('click', function(e){
    var b = e.target.closest('.chip'); if(!b) return;
    $$('.chip', filtersBox).forEach(function(x){ x.classList.remove('is-on'); x.setAttribute('aria-selected','false'); });
    b.classList.add('is-on'); b.setAttribute('aria-selected','true');
    activeCat = b.getAttribute('data-cat'); shown = PAGE; applyGrid();
  });
  if (moreBtn) moreBtn.addEventListener('click', function(){ shown += PAGE; applyGrid(); });
  applyGrid();

  /* lightbox: video nativo con stream directo de Drive (iframe de Drive como respaldo) */
  var lb = $('#lb'), lbFrame = $('#lbFrame'), lbBox = $('#lbBox'), lbTitle = $('#lbTitle'), lbBrand = $('#lbBrand'), lbSub = $('#lbSub');
  var list = [], idx = -1, lastFocus = null;
  function driveFallback(it){
    lbFrame.innerHTML = '<iframe src="https://drive.google.com/file/d/'+it.id+'/preview" scrolling="no" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="'+esc(it.title)+'"></iframe><span class="lb-shield" aria-hidden="true"></span>';
  }
  function openAt(i){
    idx = i; var it = list[i]; if(!it) return;
    lbBox.classList.toggle('is-vertical', !!it.vertical);
    lbFrame.innerHTML = '';
    var v = document.createElement('video');
    v.src = '/video/'+it.id;
    v.controls = true; v.preload = 'metadata';
    v.setAttribute('playsinline',''); v.setAttribute('controlslist','nodownload');
    if (it.poster) v.poster = it.poster;
    v.addEventListener('error', function(){ driveFallback(it); });
    lbFrame.appendChild(v);
    var pl = v.play(); if (pl && pl.catch) pl.catch(function(){});
    lbTitle.textContent = it.title; lbBrand.textContent = it.brand || it.catName; lbSub.textContent = it.catName + ' · ' + it.dur;
    lb.hidden = false; document.body.classList.add('lb-open');
    $('#lbClose').focus();
  }
  function openBySlug(slug, scope){
    list = scope; var i = list.map(function(x){ return x.slug; }).indexOf(slug); if (i<0) return; openAt(i);
  }
  function closeLb(){ lb.hidden = true; lbFrame.innerHTML=''; document.body.classList.remove('lb-open'); if(lastFocus) lastFocus.focus(); }
  document.addEventListener('click', function(e){
    var t = e.target.closest('.tile, .card'); if(!t) return;
    lastFocus = t;
    if (t.classList.contains('tile')) openBySlug(t.getAttribute('data-slug'), feats);
    else {
      var visible = $$('.card', grid).filter(function(c){ return !c.classList.contains('is-hidden'); }).map(function(c){ return DATA.filter(function(d){ return d.slug===c.getAttribute('data-slug'); })[0]; });
      openBySlug(t.getAttribute('data-slug'), visible);
    }
  });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function(){ openAt((idx-1+list.length)%list.length); });
  $('#lbNext').addEventListener('click', function(){ openAt((idx+1)%list.length); });
  lb.addEventListener('click', function(e){ if (e.target===lb) closeLb(); });
  document.addEventListener('keydown', function(e){
    if (lb.hidden) return;
    if (e.key==='Escape') closeLb();
    if (e.key==='ArrowLeft') openAt((idx-1+list.length)%list.length);
    if (e.key==='ArrowRight') openAt((idx+1)%list.length);
  });

  /* PDF: los botones enlazan directo a CV-Claudio-Martinez-Meza.pdf (Ctrl+P usa la hoja de impresión) */
})();
