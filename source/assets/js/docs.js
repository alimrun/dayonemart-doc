/* =========================================================
   DayOneMart Documentation — docs.js
   ========================================================= */

(function () {
  'use strict';

  /* ---- Theme toggle ---- */
  const THEME_KEY = 'dom-docs-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.title = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
    });
  }

  function toggleTheme() { applyTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getTheme());

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    /* ---- Mobile sidebar toggle ---- */
    document.querySelectorAll('.menu-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.toggle('open');
      });
    });

    /* ---- Active nav link ---- */
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navbar nav a').forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    /* ---- TOC active on scroll ---- */
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (tocLinks.length) {
      const sections = Array.from(tocLinks).map(a => {
        const id = a.getAttribute('href').slice(1);
        return document.getElementById(id);
      }).filter(Boolean);

      function updateActiveToc() {
        const scrollY = window.scrollY + 80;
        let active = null;
        for (const el of sections) {
          if (el.offsetTop <= scrollY) active = el;
        }
        tocLinks.forEach(a => a.classList.remove('active'));
        if (active) {
          const link = document.querySelector('.toc a[href="#' + active.id + '"]');
          if (link) {
            link.classList.add('active');
            // Scroll sidebar to keep active link in view
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
              const linkTop = link.offsetTop;
              const sidebarH = sidebar.clientHeight;
              const sidebarScroll = sidebar.scrollTop;
              if (linkTop < sidebarScroll + 60 || linkTop > sidebarScroll + sidebarH - 60) {
                sidebar.scrollTo({ top: linkTop - sidebarH / 2, behavior: 'smooth' });
              }
            }
          }
        }
      }

      window.addEventListener('scroll', updateActiveToc, { passive: true });
      updateActiveToc();
    }

    /* ---- Sidebar search ---- */
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const q = this.value.trim().toLowerCase();
        tocLinks.forEach(a => {
          const text = a.textContent.toLowerCase();
          a.parentElement.classList.toggle('search-hidden', q.length > 0 && !text.includes(q));
        });
      });

      // Keyboard shortcut: / or Ctrl+K
      document.addEventListener('keydown', function (e) {
        if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
        if (e.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
          searchInput.blur();
        }
      });
    }

    /* ---- Copy code buttons ---- */
    document.querySelectorAll('pre.code').forEach(pre => {
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.style.cssText = [
        'position:absolute', 'top:10px', 'right:10px',
        'padding:4px 10px', 'font-size:.7rem', 'border-radius:4px',
        'border:1px solid #475569', 'background:#1e293b', 'color:#94a3b8',
        'cursor:pointer', 'font-family:inherit', 'transition:background .15s,color .15s'
      ].join(';');
      btn.addEventListener('mouseenter', () => { btn.style.background = '#334155'; btn.style.color = '#f1f5f9'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = '#1e293b'; btn.style.color = '#94a3b8'; });
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(pre.textContent.replace('Copy', '').trim()).then(() => {
          btn.textContent = 'Copied!';
          btn.style.color = '#86efac';
          setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = '#94a3b8'; }, 2000);
        });
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });

    /* ---- Smooth scroll for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const top = target.offsetTop - 76;
          window.scrollTo({ top, behavior: 'smooth' });
          history.pushState(null, null, this.getAttribute('href'));
        }
      });
    });

    /* ---- Scroll progress bar ---- */
    const progressWrap = document.querySelector('.scroll-progress');
    if (progressWrap) {
      const progressBar = progressWrap.querySelector('.scroll-progress-bar');
      window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
      }, { passive: true });
    }

    /* ---- Back to top button ---- */
    const btt = document.querySelector('.back-to-top');
    if (btt) {
      window.addEventListener('scroll', function () {
        btt.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ---- Close sidebar on link click (mobile) ---- */
    document.querySelectorAll('.toc a').forEach(a => {
      a.addEventListener('click', function () {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && window.innerWidth <= 680) sidebar.classList.remove('open');
      });
    });
  });
})();
