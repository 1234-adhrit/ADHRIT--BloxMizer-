(() => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const progress = document.querySelector('.scroll-progress');
  const year = document.querySelector('#year');
  year.textContent = new Date().getFullYear();

  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }));

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const closeLightbox = () => { lightbox.hidden = true; document.body.style.overflow = ''; };
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector('img').alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('button').focus();
  }));
  lightbox.addEventListener('click', event => { if (event.target === lightbox || event.target.closest('.lightbox-close')) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  const canvas = document.querySelector('.stardust');
  const context = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, stars = [], frame = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(70, Math.floor(width / 17)) }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: Math.random() * 1.25 + .25, alpha: Math.random() * .4 + .12, phase: Math.random() * Math.PI * 2 }));
  };
  const draw = () => {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      const flicker = reduceMotion ? 1 : .67 + Math.sin(frame * .018 + star.phase) * .33;
      context.beginPath(); context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(239, 222, 255, ${star.alpha * flicker})`; context.fill();
    }
    if (!reduceMotion) { frame++; requestAnimationFrame(draw); }
  };
  resize(); draw();
  window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(); }, { passive: true });
})();
