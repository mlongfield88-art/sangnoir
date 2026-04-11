/* ========================================
   SANGNOIR — Main Scripts
   Navigation, scroll effects, cookie banner
   ======================================== */

(function () {
  'use strict';

  // --- Navigation scroll effect ---
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile menu ---
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Active nav link ---
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  const navAnchors = document.querySelectorAll('.nav__links a');
  navAnchors.forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (
      href === currentPath ||
      (currentPath === '' && href === '/') ||
      (currentPath === '/index.html' && href === '/') ||
      (currentPath.endsWith(href) && href !== '/')
    ) {
      a.classList.add('active');
    }
  });

  // --- Cookie consent ---
  var cookieBanner = document.querySelector('.cookie-banner');
  var acceptBtn = document.querySelector('.cookie-banner__btn--accept');
  var declineBtn = document.querySelector('.cookie-banner__btn--decline');

  if (cookieBanner && !localStorage.getItem('sangnoir_cookie_consent')) {
    setTimeout(function () {
      cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem('sangnoir_cookie_consent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function () {
      localStorage.setItem('sangnoir_cookie_consent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Contact form (front-end only) ---
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Message Received';
      btn.disabled = true;
      btn.style.borderColor = 'rgba(160, 163, 181, 0.2)';
      btn.style.color = 'var(--silver)';
    });
  }

  // --- Interactive car door animation ---
  var doorScene = document.querySelector('.car-door-scene');
  var doorPanel = document.querySelector('.car-door-panel');

  if (doorScene && doorPanel) {
    var doorActive = false;

    var doorObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            doorActive = true;
          } else {
            doorActive = false;
          }
        });
      },
      { threshold: 0 }
    );

    doorObserver.observe(doorScene);

    window.addEventListener('scroll', function () {
      if (!doorActive) return;

      var rect = doorScene.getBoundingClientRect();
      var viewH = window.innerHeight;

      // Progress: 0 when element enters bottom, 1 when it passes top
      var progress = (viewH - rect.top) / (viewH + rect.height);
      progress = Math.max(0, Math.min(1, progress));

      // Map progress 0.2–0.7 to door rotation 0–78deg
      var doorProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));

      // Ease-out curve for smooth door swing
      var eased = 1 - Math.pow(1 - doorProgress, 3);
      var rotation = eased * 78;

      doorPanel.style.transform = 'rotateY(' + rotation + 'deg)';

      // Activate interior elements when door starts opening
      if (doorProgress > 0.05) {
        doorScene.classList.add('active');
      } else {
        doorScene.classList.remove('active');
      }

      // Dynamic shadow on the door
      var shadowIntensity = eased * 0.6;
      doorPanel.style.boxShadow = '-' + (2 + eased * 15) + 'px 0 ' + (20 + eased * 30) + 'px rgba(0,0,0,' + shadowIntensity + ')';
    }, { passive: true });
  }

  // --- Newsletter form (front-end only) ---
  var newsletterForms = document.querySelectorAll('.footer__newsletter-form');
  newsletterForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      btn.textContent = 'Subscribed';
      btn.disabled = true;
      form.querySelector('input').disabled = true;
    });
  });
})();
