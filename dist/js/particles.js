/* ========================================
   SANGNOIR — Particle Network Effect
   Canvas-based, lightweight, no dependencies
   ======================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles, animationId;
  let mouse = { x: null, y: null, radius: 120 };

  const CONFIG = {
    count: 80,
    color: 'rgba(160, 163, 181,',
    lineColor: 'rgba(160, 163, 181,',
    maxSpeed: 0.4,
    minSize: 1,
    maxSize: 2.5,
    connectDistance: 150,
    mouseConnect: 180,
  };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;

    const density = width < 768 ? 0.5 : 1;
    const targetCount = Math.floor(CONFIG.count * density);

    if (particles && particles.length > targetCount) {
      particles.length = targetCount;
    } else if (particles && particles.length < targetCount) {
      while (particles.length < targetCount) {
        particles.push(createParticle());
      }
    }
  }

  function createParticle() {
    const size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
      size: size,
      opacity: 0.2 + Math.random() * 0.5,
    };
  }

  function init() {
    resize();
    const density = width < 768 ? 0.5 : 1;
    const count = Math.floor(CONFIG.count * density);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDistance) {
          const opacity = (1 - dist / CONFIG.connectDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = CONFIG.lineColor + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse connections
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.mouseConnect) {
          const opacity = (1 - dist / CONFIG.mouseConnect) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(6, 147, 227,' + opacity + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.color + p.opacity + ')';
      ctx.fill();
    }
  }

  function animate() {
    update();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  // Events
  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resize);

  // Reduce animation on reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    init();
    draw(); // Single frame, no animation
  } else {
    init();
    animate();
  }
})();
