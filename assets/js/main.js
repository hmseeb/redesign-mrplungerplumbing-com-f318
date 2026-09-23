/* ==========================================================================
   Mr. Plunger Plumbing — interaction layer
   Vanilla JS · no dependencies, no external requests
   ========================================================================== */
(function () {
  'use strict';

  var DESKTOP = 1024;

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) { closeNav(); } else { openNav(); }
    });
  }

  /* ---------- Services dropdown (hover on desktop, tap on mobile) ---------- */
  var menuItems = Array.prototype.slice.call(document.querySelectorAll('.has-menu'));

  function closeAllMenus(except) {
    menuItems.forEach(function (item) {
      if (item === except) return;
      var btn = item.querySelector('.nav__dropdown');
      var panel = item.querySelector('.megamenu');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.classList.remove('is-open');
    });
  }

  menuItems.forEach(function (item) {
    var btn = item.querySelector('.nav__dropdown');
    var panel = item.querySelector('.megamenu');
    if (!btn || !panel) return;

    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var isOpen = panel.classList.contains('is-open');
      closeAllMenus(item);
      panel.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    item.addEventListener('mouseenter', function () {
      if (window.innerWidth <= DESKTOP) return;
      closeAllMenus(item);
      panel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', function () {
      if (window.innerWidth <= DESKTOP) return;
      panel.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });

    // Keep keyboard focus inside the menu usable
    item.addEventListener('focusout', function (event) {
      if (window.innerWidth <= DESKTOP) return;
      if (!item.contains(event.relatedTarget)) {
        panel.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest || !event.target.closest('.has-menu')) closeAllMenus(null);
    if (window.innerWidth > DESKTOP && nav && nav.classList.contains('is-open') &&
        !event.target.closest('.nav') && !event.target.closest('.nav-toggle')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllMenus(null);
      closeNav();
    }
  });

  // Close the mobile nav after choosing an in-page destination
  Array.prototype.forEach.call(document.querySelectorAll('.nav a[href^="#"]'), function (link) {
    link.addEventListener('click', function () {
      closeNav();
      closeAllMenus(null);
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > DESKTOP) {
      closeNav();
    } else {
      closeAllMenus(null);
    }
  });

  /* ---------- Service filtering ---------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#service-cards .card'));

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var target = button.getAttribute('data-filter');

      filters.forEach(function (other) {
        var active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });

      cards.forEach(function (card) {
        var match = target === 'all' || card.getAttribute('data-category') === target;
        card.hidden = !match;
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active section highlight ---------- */
  var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
  var sections = sectionLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('to-top');
  if (toTop) {
    var toggleToTop = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 620);
    };
    toggleToTop();
    window.addEventListener('scroll', toggleToTop, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Contact form (client-side validation) ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  if (form) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    var phonePattern = /[0-9]/g;

    var validateField = function (field) {
      var value = (field.value || '').trim();
      var valid = value.length > 0;

      if (valid && field.type === 'email') valid = emailPattern.test(value);
      if (valid && field.type === 'tel') valid = (value.match(phonePattern) || []).length >= 7;

      var wrap = field.closest('.field');
      if (wrap) wrap.classList.toggle('has-error', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      return valid;
    };

    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        var wrap = field.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        status.className = 'form-status is-visible is-error';
        status.textContent = 'Please complete the highlighted fields so we can reach you.';
        firstInvalid.focus();
        return;
      }

      status.className = 'form-status is-visible';
      status.textContent = 'Thank you for contacting us. We will get back to you as soon as possible. For urgent plumbing problems, call (404) 587-2888.';
      form.reset();
      fields.forEach(function (field) {
        var wrap = field.closest('.field');
        if (wrap) wrap.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    var currentYear = new Date().getFullYear();
    if (currentYear > parseInt(yearEl.textContent, 10)) {
      yearEl.textContent = String(currentYear);
    }
  }
})();
