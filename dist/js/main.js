/* ========================================
   SANGNOIR — Motion Design
   Restrained reveals, CSS-driven transitions,
   GSAP ScrollTrigger for card-stack pinning
   ======================================== */

(function () {
  'use strict';

  var lenis = null;

  // ──────────────────────────────────────
  // Lenis Smooth Scroll
  // ──────────────────────────────────────
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ──────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────
  var nav = document.querySelector('.nav');
  var hamburger = document.querySelector('.nav__hamburger');
  var navLinks = document.querySelector('.nav__links');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

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

  // Active nav link
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '');
    if (
      href === currentPath ||
      (currentPath === '' && href === '/') ||
      (currentPath === '/index.html' && href === '/') ||
      (href.length > 1 && currentPath.endsWith(href))
    ) {
      a.classList.add('active');
    }
  });

  // ──────────────────────────────────────
  // Reduced motion check
  // ──────────────────────────────────────
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {

    // ──────────────────────────────────────
    // Hero entrance — staggered on load
    // ──────────────────────────────────────
    var heroEls = document.querySelectorAll(
      '.page-hero h1, .page-hero p, .page-hero__credential, .hero h1, .hero__sub, .hero__cta'
    );
    heroEls.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.12) + 's';
    });

    // ──────────────────────────────────────
    // Services page — Card Stack + Nav
    // ──────────────────────────────────────
    var serviceSections = document.querySelectorAll('.service-section');
    var serviceNav = document.querySelector('.service-nav');
    var cardStackActive = false;

    if (serviceSections.length === 3 && serviceNav) {
      cardStackActive = true;
      initServiceCardStack(serviceSections, serviceNav);
    }

    // ──────────────────────────────────────
    // Reveal system — IntersectionObserver + CSS transitions
    // ──────────────────────────────────────
    document.querySelectorAll('.service-section.reveal').forEach(function (section) {
      section.classList.remove('reveal');
    });
    document.querySelectorAll('.cta-banner .container.reveal').forEach(function (el) {
      el.classList.remove('reveal');
    });

    // Stagger children inside grids
    document.querySelectorAll('.pillars, .values-grid, .partner-grid, .footer__grid').forEach(function (grid) {
      var children = grid.children;
      for (var i = 0; i < children.length; i++) {
        if (!children[i].classList.contains('reveal')) {
          children[i].classList.add('reveal');
        }
        children[i].style.transitionDelay = (i * 0.08) + 's';
      }
    });

    // Stagger service section content children (only if card stack not active)
    if (!cardStackActive) {
      document.querySelectorAll('.service-section__content').forEach(function (content) {
        var items = content.querySelectorAll('h3, .service-quote, p, ul');
        items.forEach(function (item, i) {
          if (!item.classList.contains('reveal')) {
            item.classList.add('reveal');
          }
          item.style.transitionDelay = (i * 0.08) + 's';
        });
      });
    }

    // CTA banner stagger
    var ctaBanner = document.querySelector('.cta-banner .container');
    if (ctaBanner) {
      var ctaItems = ctaBanner.querySelectorAll('h2, p, a');
      ctaItems.forEach(function (item, i) {
        if (!item.classList.contains('reveal')) {
          item.classList.add('reveal');
        }
        item.style.transitionDelay = (i * 0.1) + 's';
      });
    }

    // Stats stagger
    var stats = document.querySelectorAll('.stat__number');
    stats.forEach(function (stat, i) {
      if (!stat.classList.contains('reveal')) {
        stat.classList.add('reveal');
      }
      stat.style.transitionDelay = (i * 0.06) + 's';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });

    // Videos — play/pause (only if card stack not active)
    if (!cardStackActive) {
      var serviceVideos = document.querySelectorAll('.service-section__bg');
      if (serviceVideos.length) {
        var videoObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.play().catch(function () {});
              } else {
                entry.target.pause();
              }
            });
          },
          { threshold: 0.15 }
        );
        serviceVideos.forEach(function (video) {
          videoObserver.observe(video);
        });
      }
    }
  }

  // ──────────────────────────────────────
  // Card Stack + Service Nav Functions
  // ──────────────────────────────────────

  function initServiceCardStack(sections, sNav) {
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    var pageHero = document.querySelector('.page-hero');
    var navSpacer = document.querySelector('.service-nav-spacer');
    var navLinkEls = sNav.querySelectorAll('.service-nav__link');
    var indicator = sNav.querySelector('.service-nav__indicator');
    var navHeight = 80;
    var serviceNavHeight = 48;
    var totalOffset = navHeight + serviceNavHeight;

    // --- Sticky service nav ---
    if (typeof ScrollTrigger !== 'undefined' && pageHero) {
      ScrollTrigger.create({
        trigger: pageHero,
        start: 'bottom top+=' + navHeight,
        endTrigger: '.footer',
        end: 'top bottom',
        onEnter: function () {
          sNav.classList.add('is-sticky');
          if (navSpacer) navSpacer.classList.add('is-active');
        },
        onLeaveBack: function () {
          sNav.classList.remove('is-sticky');
          if (navSpacer) navSpacer.classList.remove('is-active');
        }
      });
    }

    // --- Nav click handlers ---
    navLinkEls.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = link.getAttribute('href');
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -totalOffset });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // --- Indicator positioning ---
    function updateIndicator(activeIndex) {
      var activeLink = navLinkEls[activeIndex];
      if (!activeLink || !indicator) return;
      indicator.style.width = activeLink.offsetWidth + 'px';
      indicator.style.left = activeLink.offsetLeft + 'px';

      navLinkEls.forEach(function (l, i) {
        l.classList.toggle('is-active', i === activeIndex);
      });
    }

    // Initialize indicator
    requestAnimationFrame(function () { updateIndicator(0); });
    window.addEventListener('resize', function () {
      var activeIdx = 0;
      navLinkEls.forEach(function (l, i) { if (l.classList.contains('is-active')) activeIdx = i; });
      updateIndicator(activeIdx);
    });

    // --- Branch: mobile vs desktop ---
    if (isMobile) {
      initMobileServiceNav(sections, updateIndicator);
    } else {
      initCardStack(sections, updateIndicator, totalOffset);
    }
  }

  function initCardStack(sections, updateIndicator, totalOffset) {
    var totalSections = sections.length;

    // CSS sticky stacking — no JS pins, fully smooth scroll
    sections.forEach(function (section, i) {
      section.style.position = 'sticky';
      section.style.top = totalOffset + 'px';
      section.style.zIndex = i + 1;
    });

    // Fade out each section as the next one scrolls over it
    for (var i = 0; i < totalSections - 1; i++) {
      (function (index) {
        gsap.to(sections[index], {
          scale: 0.96,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sections[index + 1],
            start: 'top bottom',
            end: 'top top+=' + totalOffset,
            scrub: true
          }
        });
      })(i);
    }

    // Nav indicator scroll-spy
    sections.forEach(function (section, i) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top+=' + (totalOffset + 200),
        end: 'bottom top+=' + (totalOffset + 200),
        onEnter: function () { updateIndicator(i); },
        onEnterBack: function () { updateIndicator(i); }
      });
    });

    // Text reveals
    sections.forEach(function (section) {
      var contentItems = section.querySelectorAll(
        '.service-section__content .service-section__number, .service-section__content h3, .service-section__content .service-quote, .service-section__content p, .service-section__content ul'
      );

      contentItems.forEach(function (item, j) {
        item.classList.add('reveal');
        item.style.transitionDelay = (j * 0.08) + 's';
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: function () {
          contentItems.forEach(function (item) { item.classList.add('is-visible'); });
        }
      });
    });

    // Video play/pause
    sections.forEach(function (section) {
      var video = section.querySelector('.service-section__bg');
      if (!video) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: function () { video.play().catch(function () {}); },
        onLeave: function () { video.pause(); },
        onEnterBack: function () { video.play().catch(function () {}); },
        onLeaveBack: function () { video.pause(); }
      });
    });

    ScrollTrigger.refresh();
    document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  function initMobileServiceNav(sections, updateIndicator) {
    if (typeof ScrollTrigger === 'undefined') return;

    sections.forEach(function (section, i) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: function () { updateIndicator(i); },
        onEnterBack: function () { updateIndicator(i); }
      });

      // Mobile text reveals via ScrollTrigger
      var contentItems = section.querySelectorAll(
        '.service-section__content .service-section__number, .service-section__content h3, .service-section__content .service-quote, .service-section__content p, .service-section__content ul'
      );
      contentItems.forEach(function (item, j) {
        item.classList.add('reveal');
        item.style.transitionDelay = (j * 0.08) + 's';
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: function () {
          contentItems.forEach(function (item) { item.classList.add('is-visible'); });
        }
      });

      // Video play/pause
      var video = section.querySelector('.service-section__bg');
      if (video) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: function () { video.play().catch(function () {}); },
          onLeave: function () { video.pause(); },
          onEnterBack: function () { video.play().catch(function () {}); },
          onLeaveBack: function () { video.pause(); }
        });
      }
    });

    ScrollTrigger.refresh();
  }

  // ──────────────────────────────────────
  // Animated Counters
  // ──────────────────────────────────────
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('[data-counter]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-counter'));
      var suffix = el.getAttribute('data-counter-suffix') || '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(obj.val) + suffix;
            }
          });
        }
      });
    });
  }

  // ──────────────────────────────────────
  // Cursor Parallax on Service Videos
  // ──────────────────────────────────────
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    document.querySelectorAll('.service-section').forEach(function (section) {
      var video = section.querySelector('.service-section__bg');
      if (!video) return;

      section.addEventListener('mousemove', function (e) {
        var rect = section.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(video, {
          x: x * 20,
          y: y * 10,
          duration: 1.2,
          ease: 'power2.out'
        });
      });

      section.addEventListener('mouseleave', function () {
        gsap.to(video, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
      });
    });
  }

  // ──────────────────────────────────────
  // Cookie Consent
  // ──────────────────────────────────────
  var cookieBanner = document.querySelector('.cookie-banner');
  var acceptBtn = document.querySelector('.cookie-banner__btn--accept');
  var declineBtn = document.querySelector('.cookie-banner__btn--decline');

  if (cookieBanner && !localStorage.getItem('sangnoir_cookie_consent')) {
    setTimeout(function () { cookieBanner.classList.add('visible'); }, 1500);
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

  // ──────────────────────────────────────
  // Contact Form
  // ──────────────────────────────────────
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

  // ──────────────────────────────────────
  // Newsletter Form
  // ──────────────────────────────────────
  document.querySelectorAll('.footer__newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      btn.textContent = 'Subscribed';
      btn.disabled = true;
      form.querySelector('input').disabled = true;
    });
  });
})();
