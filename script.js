/* ============================
   OmniGaia • Meta-Style Script
   ============================ */

/* --------- helpers --------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const prefersNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------- overlay menu ------ */
const menu      = $('#menu');
const openBtn   = $('.hamburger');
const closeBtn  = $('.menu-close');

function openMenu() {
  if (!menu) return;
  menu.classList.add('open');
  // focus first link for a11y
  const first = $('a,button', menu);
  first && first.focus({ preventScroll: true });
}
function closeMenu() {
  menu?.classList.remove('open');
}
openBtn?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);

// close on link click / backdrop click / ESC
menu?.addEventListener('click', (e) => {
  const nav = $('.menu-nav', menu);
  if (!nav) return;
  if (e.target === menu && !nav.contains(e.target)) closeMenu(); // backdrop
  if (e.target.closest('a')) closeMenu(); // any link
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ---- sticky nav shadow ----- */
const nav = $('.nav');
function updateNavShadow() {
  if (!nav) return;
  if (window.scrollY > 8) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
updateNavShadow();
window.addEventListener('scroll', updateNavShadow, { passive: true });

/* ----- active link state ---- */
function setActiveLinks() {
  const path = location.pathname.replace(/index\.html?$/, '');
  const links = [...$$('.links a'), ...$$('#menu .menu-nav a')];
  links.forEach(a => {
    try {
      const href = new URL(a.getAttribute('href'), location.origin).pathname
        .replace(/index\.html?$/, '');
      a.classList.toggle('active', href === path);
    } catch (_) { /* ignore invalid URLs */ }
  });
}
setActiveLinks();

/* ---- smooth anchor scroll --- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  const target = id && id !== '#' ? document.querySelector(id) : null;
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: prefersNoMotion ? 'auto' : 'smooth', block: 'start' });
});

/* ------ scroll reveal -------- */
if (!prefersNoMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('show');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('show'));
}

/* ------- lazy images --------- */
/* <img data-src="real.jpg" alt=""> */
(() => {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const load = (img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  };

  const imgIO = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            load(en.target);
            imgIO.unobserve(en.target);
          }
        });
      }, { rootMargin: '200px 0px' })
    : null;

  imgs.forEach(img => imgIO ? imgIO.observe(img) : load(img));
})();

/* ------- metric counter ------ */
/* <div class="count" data-target="1200">0</div> */
(() => {
  const counters = $$('.count[data-target]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.target || '0');
    const duration = 900; // ms
    const start = performance.now();
    const from = Number(el.textContent.replace(/[^\d.-]/g, '')) || 0;

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const val = Math.floor(from + (target - from) * (prefersNoMotion ? 1 : p));
      el.textContent = Intl.NumberFormat().format(val);
      if (p < 1 && !prefersNoMotion) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animate(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => io.observe(c));
})();

/* ---- external links new tab -- */
$$('a[target="_blank"], a[href^="http"]').forEach(a => {
  try {
    const url = new URL(a.href);
    if (url.origin !== location.origin) {
      a.setAttribute('rel', 'noopener noreferrer');
      if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
    }
  } catch (_) { /* ignore */ }
});

/* ------- small utility ------- */
window.OmniGaia = {
  openMenu, closeMenu,
  version: 'meta-style-1.0.0'
};
