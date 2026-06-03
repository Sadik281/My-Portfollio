/**
 * SADIK.DEV — Portfolio JavaScript
 * Features: Canvas grid, cursor, typing, scroll, counters, form validation, theme
 */

/* ─── DOM READY ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initCursor();
  initNavbar();
  initTyping();
  initReveal();
  initSkillBars();
  initCounters();
  initForm();
  initScrollProgress();
  initBackToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ─── THEME ──────────────────────────────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('sadik-theme') || 'dark';
  body.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('sadik-theme', next);
  });
}

/* ─── HERO CANVAS — animated grid + particles ────────────────── */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.5 + .3,
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      a: Math.random()
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(59,130,246,.06)';
    ctx.lineWidth = 1;
    const gSize = 50;
    for (let x = 0; x < W; x += gSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${p.a * .6})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${.08 * (1 - dist/120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }
  draw();
}

/* ─── CUSTOM CURSOR ──────────────────────────────────────────── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(hover:none)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function followLoop() {
    fx += (mx - fx) * .12;
    fy += (my - fy) * .12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followLoop);
  })();

  // Hover expand
  document.querySelectorAll('a, button, .skill-card, .project-card, .strength-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '52px';
      follower.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '32px';
      follower.style.height = '32px';
    });
  });
}

/* ─── NAVBAR ─────────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll classes
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightNavLink();
  });

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY;

  sections.forEach(sec => {
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    const link   = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

/* ─── TYPING ANIMATION ───────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('roleType');
  if (!el) return;

  const roles = [
    'Computer Science Student',
    'Web Developer',
    'Future Android Engineer',
    'Problem Solver'
  ];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const text = roles[ri];
    if (!deleting) {
      el.textContent = text.slice(0, ++ci);
      if (ci === text.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = text.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
}

/* ─── REVEAL ON SCROLL ───────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── SKILL BARS ──────────────────────────────────────────────── */
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.classList.add('animated');
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-group').forEach(g => observer.observe(g));
}

/* ─── COUNTERS ───────────────────────────────────────────────── */
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.counter').forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const step = target / 40;
          const timer = setInterval(() => {
            count = Math.min(count + step, target);
            counter.textContent = Math.floor(count);
            if (count >= target) clearInterval(timer);
          }, 35);
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.github-stats').forEach(el => observer.observe(el));
}

/* ─── FORM VALIDATION ────────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function showError(fieldId, errorId, msg) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    field.classList.add('error');
    err.textContent = msg;
  }
  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    field.classList.remove('error');
    err.textContent = '';
  }

  // Real-time clear
  ['fname','femail','fsubject','fmessage'].forEach((id, i) => {
    const errIds = ['nameError','emailError','subjectError','messageError'];
    document.getElementById(id)?.addEventListener('input', () => clearError(id, errIds[i]));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const subject = document.getElementById('fsubject').value.trim();
    const message = document.getElementById('fmessage').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    clearError('fname','nameError');
    clearError('femail','emailError');
    clearError('fsubject','subjectError');
    clearError('fmessage','messageError');

    if (!name)              { showError('fname','nameError','Please enter your name.'); valid=false; }
    if (!emailRe.test(email)) { showError('femail','emailError','Please enter a valid email.'); valid=false; }
    if (!subject)           { showError('fsubject','subjectError','Please enter a subject.'); valid=false; }
    if (message.length < 10) { showError('fmessage','messageError','Message must be at least 10 characters.'); valid=false; }

    if (!valid) return;

    // Simulate send
    const btn = document.getElementById('btnText');
    btn.textContent = 'Sending…';
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      const success = document.getElementById('formSuccess');
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1200);
  });
}

/* ─── SCROLL PROGRESS ────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  });
}

/* ─── BACK TO TOP ────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}