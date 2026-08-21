/* ==========================================================================
   Sagar International Manpower — interaction layer
   Vanilla ES2018. GSAP + ScrollTrigger + Lenis, all served locally.
   Every effect degrades to a readable static page when JS is off or when
   the visitor prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Smooth scroll ─────────────────────────────────────────────────── */
  var lenis = null;
  function initSmoothScroll() {
    if (reduced || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      syncTouch: false,          // native momentum on touch — feels better and costs nothing
      touchMultiplier: 1.6
    });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollToTarget(el) {
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* ── Loader ────────────────────────────────────────────────────────── */
  function initLoader(done) {
    var loader = $('.loader');
    if (!loader) { done(); return; }

    var seen = false;
    try { seen = sessionStorage.getItem('sim-intro') === '1'; } catch (e) {}

    if (seen || reduced || !hasGSAP) {
      loader.hidden = true;
      document.body.classList.remove('is-locked');
      done();
      return;
    }

    document.body.classList.add('is-locked');
    var countEl = $('.loader__count', loader);
    var fill = $('.loader__fill', loader);
    var counter = { v: 0 };

    var tl = gsap.timeline({
      onComplete: function () {
        loader.hidden = true;
        document.body.classList.remove('is-locked');
        try { sessionStorage.setItem('sim-intro', '1'); } catch (e) {}
        done();
      }
    });
    tl.to(counter, {
      v: 100, duration: 1.25, ease: 'power2.inOut',
      onUpdate: function () { if (countEl) countEl.textContent = String(Math.round(counter.v)).padStart(3, '0'); }
    }, 0);
    if (fill) tl.to(fill, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0);
    tl.to(loader, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '+=0.15');
  }

  /* ── Header ────────────────────────────────────────────────────────── */
  function initHeader() {
    var header = $('.header');
    if (!header) return;
    var last = 0;
    var onScroll = function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle('is-stuck', y > 24);
      // hide on scroll-down past the fold, reveal on scroll-up
      if (y > 320 && y > last + 6 && !document.body.classList.contains('is-locked')) {
        header.classList.add('is-hidden');
      } else if (y < last - 6) {
        header.classList.remove('is-hidden');
      }
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Scroll progress ───────────────────────────────────────────────── */
  function initProgress() {
    var bar = $('.progress');
    if (!bar) return;
    var update = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max)) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* ── Mobile menu ───────────────────────────────────────────────────── */
  function initMenu() {
    var burger = $('.burger');
    var menu = $('.menu');
    if (!burger || !menu) return;
    var items = $$('.menu__item', menu);
    var focusables = 'a[href], button:not([disabled]), input, select, textarea';
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      if (lenis) lenis.stop();
      if (hasGSAP && !reduced) {
        gsap.fromTo(items,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.045, ease: 'expo.out', delay: 0.18, clearProps: 'transform' });
      }
      var first = menu.querySelector(focusables);
      if (first) setTimeout(function () { first.focus(); }, 320);
    }
    function close() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    }
    burger.addEventListener('click', function () {
      menu.classList.contains('is-open') ? close() : open();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = $$(focusables, menu).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1080 && menu.classList.contains('is-open')) close();
    });
  }

  /* ── Custom cursor (fine pointers only) ────────────────────────────── */
  function initCursor() {
    if (isTouch || reduced || !hasGSAP) return;
    var dot = document.createElement('div');
    dot.className = 'cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);

    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
    var setX = gsap.quickSetter(dot, 'x', 'px');
    var setY = gsap.quickSetter(dot, 'y', 'px');

    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!dot.classList.contains('is-active')) dot.classList.add('is-active');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { dot.classList.remove('is-active'); });

    gsap.ticker.add(function () {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      setX(x); setY(y);
    });

    var hoverSel = 'a, button, .card, .track__pane, [data-cursor]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) dot.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverSel))) {
        dot.classList.remove('is-hover');
      }
    });
  }

  /* ── Reveals ───────────────────────────────────────────────────────── */
  function initReveals() {
    if (!hasGSAP || reduced) {
      $$('.reveal, .reveal-fade').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      $$('.clip-up').forEach(function (el) { el.style.clipPath = 'none'; });
      return;
    }

    // Batched so items entering together animate as one wave (cheaper than 1 trigger each)
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.72, ease: 'expo.out',
          stagger: { each: 0.07, from: 'start' }, overwrite: true
        });
      }
    });

    ScrollTrigger.batch('.reveal-fade', {
      start: 'top 92%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, duration: 0.9, ease: 'power1.out', stagger: 0.08, overwrite: true });
      }
    });

    // Headline line-masks: each <span> line slides up behind its clip.
    // Hero lines are owned by initHero(), so skip them here.
    $$('.line-mask').filter(function (m) { return !m.closest('.hero'); }).forEach(function (mask) {
      var lines = $$('span', mask);
      if (!lines.length) return;
      gsap.set(lines, { yPercent: 130 });
      gsap.to(lines, {
        yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.075,
        scrollTrigger: { trigger: mask, start: 'top 92%', once: true }
      });
    });

    // Reveal-on-scroll clip panels
    $$('.clip-up').forEach(function (el) {
      gsap.to(el, {
        clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Gentle parallax on media panels (desktop only, transform-only)
    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', function () {
      $$('[data-parallax]').forEach(function (el) {
        var amount = parseFloat(el.getAttribute('data-parallax')) || 8;
        gsap.fromTo(el, { yPercent: -amount / 2 }, {
          yPercent: amount / 2, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      });
    });
  }

  /* ── Hero intro ────────────────────────────────────────────────────── */
  function initHero() {
    var hero = $('.hero');
    if (!hero) return;

    // Draw the route arcs
    $$('.route-path', hero).forEach(function (p) {
      var len = p.getTotalLength ? p.getTotalLength() : 1000;
      p.style.setProperty('--len', len);
      if (!hasGSAP || reduced) { p.style.strokeDashoffset = 0; return; }
      gsap.fromTo(p, { strokeDashoffset: len }, {
        strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', delay: 0.5
      });
    });

    if (!hasGSAP || reduced) return;

    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    var lines = $$('.hero__title .line-mask > span');
    gsap.set(lines, { yPercent: 130 });

    tl.from('.hero .eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.05)
      .to(lines, { yPercent: 0, duration: 1.15, stagger: 0.085 }, 0.15)
      .from('.hero__lead', { opacity: 0, y: 18, duration: 0.8 }, 0.55)
      .from('.hero .btn-row > *', { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 }, 0.65)
      .from('.hero__scroll', { opacity: 0, duration: 0.6 }, 0.9)
      .from('.hero__stats .stat', { opacity: 0, y: 22, duration: 0.8, stagger: 0.07 }, 0.75)
      .from('.hero__routes', { opacity: 0, duration: 1.4 }, 0.2);

    // Fade the hero content as it leaves — transform + opacity only
    var mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', function () {
      gsap.to('.hero__inner', {
        opacity: 0.15, yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 30%', scrub: 0.6 }
      });
    });
  }

  /* ── Hero background video ─────────────────────────────────────────── */
  function initHeroVideo() {
    var video = $('.hero__video');
    if (!video) return;
    var toggle = $('.hero__vtoggle');
    var label = toggle && $('.hero__vtoggle-label', toggle);
    var hero = $('.hero');

    // Slow it right down — at full speed the map motion competes with the
    // headline instead of sitting behind it.
    var RATE = 0.4;
    function slow() { try { video.playbackRate = RATE; } catch (e) {} }
    slow();
    video.addEventListener('loadedmetadata', slow);
    video.addEventListener('play', slow);

    // Plays for everyone by default. WCAG 2.2.2 is satisfied by the pause
    // control below, which is also the way out for anyone who wants stillness.
    var wantsPlay = true;
    var onScreen = true;

    function syncToggle() {
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', String(!wantsPlay));
      toggle.classList.toggle('is-paused', !wantsPlay);
      if (label) label.textContent = (wantsPlay ? 'Pause' : 'Play') + ' background video';
    }

    function apply() {
      if (wantsPlay && onScreen) {
        slow();
        var p = video.play();
        // A rejection here is usually transient — a background tab, or data not
        // ready yet. Intent stays "playing" and we retry on the hooks below,
        // rather than dumping the visitor on a button they have to find.
        if (p && p.catch) p.catch(function () {});
      } else if (!video.paused) {
        video.pause();
      }
    }

    // Retry points for a blocked start, so it recovers on its own.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) apply();
    });
    // Once only. A looping video fires canplay on every cycle, and re-calling
    // apply() from it can spin play -> pause -> canplay -> play on the main thread.
    video.addEventListener('canplay', apply, { once: true });
    // Last resort: any first interaction counts as a gesture and unblocks autoplay
    // in the strictest browsers. Fires once, then gets out of the way.
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, function once() {
        ['pointerdown', 'keydown', 'touchstart'].forEach(function (e2) {
          document.removeEventListener(e2, once);
        });
        apply();
      }, { passive: true });
    });

    if (toggle) {
      toggle.addEventListener('click', function () {
        wantsPlay = !wantsPlay;
        syncToggle();
        apply();
      });
      syncToggle();
    }

    // Stop decoding frames once the hero has scrolled away
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { onScreen = e.isIntersecting; });
        apply();
      }, { threshold: 0.05 }).observe(hero);
    }

    apply();
  }

  /* ── Marquees ──────────────────────────────────────────────────────── */
  function initMarquees() {
    $$('.marquee').forEach(function (m) {
      var track = $('.marquee__track', m);
      var group = $('.marquee__group', track);
      if (!track || !group) return;

      // With motion off the marquee renders as a static wrapped list — no clones needed
      if (!hasGSAP || reduced) return;

      // Duplicate the group until it comfortably covers 2x the viewport
      var needed = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(group.offsetWidth, 1)) + 1);
      for (var i = track.children.length; i < needed; i++) {
        var clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }

      var speed = parseFloat(m.getAttribute('data-speed')) || 28;
      var dir = m.getAttribute('data-dir') === 'right' ? 1 : -1;
      var w = group.offsetWidth;
      var tween = gsap.to(track, {
        x: dir * -w, duration: w / speed, ease: 'none', repeat: -1,
        modifiers: { x: function (v) { return (parseFloat(v) % w) + 'px'; } }
      });
      if (dir === 1) gsap.set(track, { x: -w });

      // Pause while offscreen — no wasted frames
      ScrollTrigger.create({
        trigger: m, start: 'top bottom', end: 'bottom top',
        onToggle: function (self) { self.isActive ? tween.play() : tween.pause(); }
      });
      m.addEventListener('mouseenter', function () { gsap.to(tween, { timeScale: 0.25, duration: 0.4 }); });
      m.addEventListener('mouseleave', function () { gsap.to(tween, { timeScale: 1, duration: 0.4 }); });
    });
  }

  /* ── Counters ──────────────────────────────────────────────────────── */
  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = (el.getAttribute('data-decimals') | 0);
      var format = function (v) {
        return v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      };
      if (!hasGSAP || reduced) { el.textContent = format(target); return; }
      var obj = { v: 0 };
      el.textContent = format(0);
      gsap.to(obj, {
        v: target, duration: 1.8, ease: 'power2.out',
        onUpdate: function () { el.textContent = format(obj.v); },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }

  /* ── Accordions ────────────────────────────────────────────────────── */
  function initAccordions() {
    $$('.acc').forEach(function (acc) {
      var single = acc.hasAttribute('data-single');
      $$('.acc__btn', acc).forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        panel.style.height = expanded ? 'auto' : '0px';

        btn.addEventListener('click', function () {
          var isOpen = btn.getAttribute('aria-expanded') === 'true';
          if (single && !isOpen) {
            $$('.acc__btn[aria-expanded="true"]', acc).forEach(function (other) {
              if (other !== btn) toggle(other, document.getElementById(other.getAttribute('aria-controls')), false);
            });
          }
          toggle(btn, panel, !isOpen);
        });
      });

      function toggle(btn, panel, open) {
        btn.setAttribute('aria-expanded', String(open));
        if (!hasGSAP || reduced) { panel.style.height = open ? 'auto' : '0px'; return; }
        var inner = $('.acc__panel-inner', panel);
        var h = inner ? inner.offsetHeight : panel.scrollHeight;
        gsap.killTweensOf(panel);
        if (open) {
          gsap.fromTo(panel, { height: 0 }, {
            height: h, duration: 0.5, ease: 'expo.out',
            onComplete: function () { panel.style.height = 'auto'; ScrollTrigger.refresh(); }
          });
          if (inner) gsap.fromTo(inner, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, delay: 0.06, ease: 'power2.out' });
        } else {
          gsap.to(panel, {
            height: 0, duration: 0.4, ease: 'expo.inOut',
            onComplete: function () { ScrollTrigger.refresh(); }
          });
        }
      }
    });
  }

  /* ── Pinned horizontal process ─────────────────────────────────────── */
  function initProcess() {
    var section = $('.process');
    if (!section || !hasGSAP) return;
    var track = $('.process__track', section);
    if (!track) return;

    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', function () {
      var distance = function () { return Math.max(0, track.scrollWidth - section.offsetWidth + 96); };
      section.classList.add('is-pinned');
      var tween = gsap.to(track, {
        x: function () { return -distance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top+=' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76),
          end: function () { return '+=' + distance(); },
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      return function () {
        section.classList.remove('is-pinned');
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { x: 0 });
      };
    });
  }

  /* ── Sticky index scrollspy ────────────────────────────────────────── */
  function initScrollspy() {
    var list = $('.idx-list');
    if (!list) return;
    var links = $$('a[href^="#"]', list);
    if (!links.length) return;

    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(a.getAttribute('href').slice(1));
        if (!t) return;
        e.preventDefault();
        scrollToTarget(t);
        history.replaceState(null, '', a.getAttribute('href'));
      });
    });

    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── In-page anchors ───────────────────────────────────────────────── */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]:not(.idx-list a)');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  }

  /* ── Forms ─────────────────────────────────────────────────────────── */
  function initForms() {
    var uid = 0;

    $$('form[data-form]').forEach(function (form) {
      // Kept out of the markup on purpose: with JS off the browser's own
      // validation is the only thing standing between a visitor and a silent
      // empty submit. We only take over once we know we are here to do it.
      form.noValidate = true;

      var status = $('.form__status', form);
      var submit = form.querySelector('[type="submit"]');

      // Associate each control with its hint and its error message, so a
      // screen reader announces "Approximate is fine at this stage" and
      // "Please enter a headcount of at least 1" instead of just "invalid".
      $$('.field', form).forEach(function (field) {
        var ctrl = field.querySelector('input, select, textarea');
        if (!ctrl) return;
        if (!ctrl.id) ctrl.id = 'fld-' + (++uid);
        var hint = $('.field__hint', field);
        var err = $('.field__error', field);
        var base = [];
        if (hint) { if (!hint.id) hint.id = ctrl.id + '-hint'; base.push(hint.id); }
        if (err && !err.id) err.id = ctrl.id + '-err';
        field.__ctrl = ctrl;
        field.__err = err;
        field.__hints = base;
        if (base.length) ctrl.setAttribute('aria-describedby', base.join(' '));
      });

      function mark(field, invalid) {
        if (!field || !field.__ctrl) return;
        var ctrl = field.__ctrl;
        field.classList.toggle('is-invalid', invalid);
        var ids = (field.__hints || []).slice();
        if (invalid) {
          ctrl.setAttribute('aria-invalid', 'true');
          if (field.__err) ids.push(field.__err.id);
        } else {
          ctrl.removeAttribute('aria-invalid');
        }
        if (ids.length) ctrl.setAttribute('aria-describedby', ids.join(' '));
        else ctrl.removeAttribute('aria-describedby');
      }

      // Clear the error as soon as the visitor fixes it
      function recheck(e) {
        var field = e.target.closest('.field');
        if (field && field.classList.contains('is-invalid') && e.target.checkValidity()) mark(field, false);
      }
      form.addEventListener('input', recheck);
      form.addEventListener('change', recheck);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        $$('.field', form).forEach(function (f) { mark(f, false); });

        var invalid = $$('input, select, textarea', form).filter(function (el) {
          return !el.disabled && !el.checkValidity();
        });

        if (invalid.length) {
          invalid.forEach(function (el) { mark(el.closest('.field'), true); });
          showStatus(status, 'err', invalid.length + ' field' + (invalid.length > 1 ? 's need' : ' needs') +
            ' your attention — see the messages below each one.');
          invalid[0].focus();
          return;
        }

        var endpoint = form.getAttribute('data-endpoint');
        var data = new FormData(form);

        if (!endpoint) {
          // No backend wired yet → hand the enquiry to the visitor's mail client
          // so nothing is ever silently lost. See README: "Wiring up the forms".
          var to = form.getAttribute('data-mailto') || 'manpowersagar@gmail.com';
          var subject = form.getAttribute('data-subject') || 'Website enquiry';
          var body = [];
          data.forEach(function (v, k) {
            if (k.charAt(0) === '_') return;
            body.push(k.replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + ': ' + v);
          });
          window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body.join('\n'));
          showStatus(status, 'ok', 'Opening your email app with the enquiry filled in — press send and we will reply within one working day.');
          return;
        }

        if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = 'Sending…'; }
        showStatus(status, 'ok', 'Sending your enquiry…');

        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error('bad response'); return r; })
          .then(function () {
            form.reset();
            $$('.field', form).forEach(function (f) { mark(f, false); });
            showStatus(status, 'ok', 'Thank you — your enquiry is with our team. Expect a reply within one working day.');
          })
          .catch(function () {
            showStatus(status, 'err', 'Something went wrong sending that. Please email manpowersagar@gmail.com or call +91 99363 96396.');
          })
          .then(function () {
            if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Send'; }
          });
      });
    });

    function showStatus(el, kind, msg) {
      if (!el) return;
      el.className = 'form__status is-visible form__status--' + kind;
      el.textContent = msg;
    }
  }

  /* ── Year stamp ────────────────────────────────────────────────────── */
  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  /* ── Boot ──────────────────────────────────────────────────────────── */
  function boot() {
    initSmoothScroll();
    initHeader();
    initProgress();
    initMenu();
    initCursor();
    initAnchors();
    initAccordions();
    initForms();
    initYear();
    initMarquees();
    initScrollspy();
    initHeroVideo();

    initLoader(function () {
      initHero();
      initReveals();
      initCounters();
      initProcess();
      if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
    });

    // Fonts land after first paint and change measured heights
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
