# Sangnoir: Website

Corporate website for Sang Noir Limited, a risk management and security consultancy. Dark, sophisticated aesthetic with subtle animations. Military heritage positioning.

## Stack
- **Framework**: Static HTML/CSS/JS (no build framework)
- **Animations**: GSAP 3 + ScrollTrigger (CDN), CSS transitions, IntersectionObserver
- **Smooth Scroll**: Lenis v1 (CDN)
- **Canvas**: Particle network effect on hero sections
- **Fonts**: Google Fonts (Cormorant Garamond + Inter)
- **Deployment**: Cloudflare Pages (auto-builds on push)
- **Dev Server**: `npx serve dist -l 3456`

## Design System
- **Palette**: Midnight `#0D0F1A` (bg), Deep Navy `#1B1E34`, Slate `#2C2F45`, Steel `#3D4060`, Silver `#A0A3B5` (secondary text), Ice `#E8E9F0`, White `#FFFFFF` (primary text), Signal Blue `#0693E3` (accent/CTA)
- **Fonts**: Cormorant Garamond (serif, headings, weights 300-700), Inter (sans, body, weights 300-600)
- **Spacing**: Section padding 120px (80px tablet, 64px mobile), max-width 1200px
- **Transitions**: 0.3s ease (standard), 0.7s cubic-bezier(0.16, 1, 0.3, 1) (scroll reveals)

## Animation Patterns
- **Scroll reveals**: `.reveal` class + IntersectionObserver (opacity + translateY 24px, threshold 0.12)
- **Stagger**: 0.08s delay between children (pillars, grids, service blocks)
- **Hero stagger**: 0.12s per element on page load
- **Parallax**: GSAP ScrollTrigger on `.service-block__visual--img` only
- **Particle network**: Canvas API, 80 particles, mouse interaction radius 120px
- **Video**: Auto-play on scroll via IntersectionObserver
- **Nav**: Scroll-aware background, hamburger animation on mobile

## Pages
| Page | Route | File |
|------|-------|------|
| Home | `/` | `dist/index.html` |
| Who We Are | `/who-we-are` | `dist/who-we-are.html` |
| Services | `/services` | `dist/services.html` |
| Partners | `/partners` | `dist/partners.html` |
| Case Studies | `/case-studies` | `dist/case-studies.html` |
| Contact | `/contact` | `dist/contact.html` |
| Privacy Policy | `/privacy-policy` | `dist/privacy-policy.html` |

## Key Files
- `dist/css/styles.css`: Monolithic stylesheet (1347 lines) with CSS custom properties
- `dist/js/main.js`: Navigation, scroll reveals, GSAP parallax, Lenis init, forms
- `dist/js/particles.js`: Canvas particle network effect

## Deploy
Push to main triggers GitHub Action which deploys dist/ to Cloudflare Pages (sangnoir.pages.dev).

## Business Info
- **Domain**: sangnoir.co.uk
- **Tagline**: "Safeguarding All That Matters to You"
- **Phone**: +44 7984 386 017
- **Email**: enquiries@sangnoir.co.uk

## UI/UX Design Tools
- Use **GSAP + ScrollTrigger** for scroll-driven animations and parallax
- Use **Lenis** for smooth scrolling
- Use **21st.dev Magic** MCP tools for component generation and inspiration
- Use **CSS custom properties** for theming and design tokens
- Use **IntersectionObserver** for scroll-triggered reveals with staggered timing

## Model routing

Inherits from `../CLAUDE.md` (Web Design parent). Default **Sonnet** for build, code, animation, and deploy work. Use **Opus** for group-level brand voice (LX Sixty corporate, ProLuxe agency, Sangnoir corporate, Capsian Invest investor copy) and any client-facing proposal narrative. Use **Haiku** for asset rename, sitemap regeneration, deploy status checks, and simple find-replace.

## Connected Projects
- **Part of**: Web Design (LX Sixty Group in-house capability)
- **Root brain**: `../../CLAUDE.md` (full group structure and cross-connections)
- **Sangnoir Risk Management**: `../../SANGNOIR Risk Management/CLAUDE.md` (operational/strategic context; site content must align)
- **ProLuxe Travel site**: `../proluxe-travel/CLAUDE.md` (sister company site, Sang Noir holds 30% of ProLuxe)
- **LX Sixty corporate**: `../lx-sixty/CLAUDE.md` (group corporate site, references Sangnoir as connected entity)
