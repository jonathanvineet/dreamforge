# DreamForge — Design System & Architectural Specification

> **Document Version:** 1.0.0  
> **Last Updated:** September 2026  
> **Product:** DreamForge (Custom 3D Printing & Design Studio)  
> **Repository:** `jonathanvineet/dreamforge`  

---

## 1. Brand Identity & Creative Philosophy

DreamForge is a high-precision 3D printing and digital fabrication studio specializing in custom figurines, rapid engineering prototypes, functional hardware, and bespoke artisanal pieces. 

The aesthetic marries **refined industrial minimalism** with **futuristic cyber-forge lighting**:
- **The Obsidian Canvas:** Deep dark backgrounds (`#0a0a0a` to `#111111`) evoke precision optical darkrooms and advanced manufacturing cleanrooms.
- **The Dual-Light Signature:**
  - **Laser Cyan (`#00E5FF` / `#00F0FF`):** Symbolizes digital CAD precision, UV stereolithography (SLA) curing lasers, and calibrated toolpaths.
  - **Molten Forge Amber (`#FFA500` / `#FF4500`):** Represents high-temperature FDM extruders, thermal sintering, and craftsmanship.
- **Translucent Glassmorphism:** Subtle frosted glass surfaces (`backdrop-blur-md`, delicate `border-white/10` to `border-white/15`) create depth without visual noise.

---

## 2. Official Brand Mark & Visual Assets

### 2.1 The Official Emblem (`DreamForge_LOGO.png`)
- **Location:** `public/logo/DreamForge_LOGO.png`
- **Iconography:** A circular emblem featuring an arched *"DREAM FORGE"* header, a central stylized 3D printer extruder nozzle, and radiating linear toolpath rays.
- **Implementation Rules:**
  - Standard circular avatar clipping (`rounded-full object-cover shrink-0 select-none`) to preserve the medallion silhouette.
  - Applied consistently in:
    - **Header Navigation:** `src/components/Nav.tsx` (`w-8 h-8`)
    - **Hero Top Bar:** `src/components/Hero.tsx` (`w-8 h-8`)
    - **Project Gallery Header:** `src/views/ProjectsPage.tsx` (`w-8 h-8`)
    - **Footer:** `src/components/Footer.tsx` (`w-8 h-8`)
    - **Core Component:** `src/components/DreamForgeLogo.tsx`
  - **Favicon & Browser Metadata:**
    - `index.html`: Linked as `icon`, `shortcut icon`, `apple-touch-icon`, `og:image`, and `twitter:image`.
    - `src/app/layout.tsx`: Next.js metadata icons & openGraph configurations.
    - `public/favicon.svg` & `public/logo.svg`: Embedded SVG wrappers referencing `DreamForge_LOGO.png`.

---

## 3. Color Palette & Lighting Tokens

The color system uses Tailwind CSS utility classes mapped to CSS custom variables in `src/index.css`.

### 3.1 Primary HSL Design System Tokens
| Token | HSL / Hex Equivalent | Primary Application |
| :--- | :--- | :--- |
| `--background` | `hsl(40, 14%, 97%)` / dark slate overrides | Canvas foundation |
| `--surface` | `hsl(36, 12%, 95%)` / dark glass | Container panels |
| `--foreground` | `hsl(24, 10%, 12%)` / white `#FFFFFF` | Primary headlines and high-contrast labels |
| `--foreground-soft` | `hsl(24, 8%, 28%)` / `zinc-400` | Secondary descriptions and body text |
| `--muted` | `hsl(30, 8%, 90%)` / `zinc-800` | Inactive pills, subtle dividers, background grids |
| `--border` | `hsl(24, 8%, 88%)` / `white/10` | Refraction hairline borders |
| `--ring` | `hsl(24, 10%, 30%)` / `#00E5FF` | Focus rings and interactive glow accents |

### 3.2 Accent & Emissive Lighting
- **Cyan Laser Accent:** `#00E5FF` (`rgba(0, 229, 255, 1)`)
  - Glow filter: `drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]`
  - Hover highlights: `group-hover:text-cyan-400`, `border-[#00E5FF]/60`
  - Ambient gradient fills: `bg-cyan-500/[0.03]`
- **Forge Ember Accent:** `#FFA500` / `#FF4500`
  - Gradient accent: `linear-gradient(0deg, #FF4500 0%, #FFA500 50%, #FFD700 100%)`
  - Ambient corner blur: `bg-amber-500/[0.03]`
- **Backdrop Vignette & Gradients:**
  - Dark layered gradient: `linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)`
  - Dynamic perspective grid: `rgba(0, 229, 255, 0.04)`

---

## 4. Typography Hierarchy

The typography pairs warm editorial serif display headers with ultra-clean geometric sans-serif UI typography:

| Role | Font Family | Tailwind / CSS Class | Typical Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Editorial Headlines** | `Fraunces`, serif | `font-display` or `font-['Fraunces']` | Regular (400) / Medium (500) | Section titles ("Got an idea? Let's make it.", "What We Make") |
| **Hero Display** | `Outfit`, sans-serif | `font-outfit` | ExtraBold (800 / 900) | Large letter-masked hero title (`DREAMFORGE`) |
| **Futuristic Accents** | `Syne`, sans-serif | `font-syne` | Bold (700 / 800) | Selected badges and artistic callouts |
| **Interface & Body** | `Inter`, sans-serif | `font-sans` | Regular (400) / Semibold (600) | Navigation links, form fields, cards, modal content |
| **Technical Markers** | Monospace System | `font-mono` | Medium (500) | Index counters (`01`, `02`), layer heights, CAD telemetry |

---

## 5. Layout & Component Architecture

```
[App / Root Layout]
 ├── CursorDot (Interactive custom mouse follower)
 ├── Nav (Floating glass capsule bar: Logo, Links, Quote CTA)
 ├── Routes
 │    ├── Route: "/" (Index View)
 │    │    ├── Hero (Interactive perspective canvas + ambient video + staggered typography)
 │    │    ├── About (Studio philosophy, high-precision narrative, photo cards)
 │    │    ├── Categories / "What We Make" (6 service specimen cards with image reveals)
 │    │    ├── BentoShowcase (Curated 6-item bento grid with modal preview)
 │    │    ├── Order (Interactive quote builder with EmailJS & WhatsApp dispatch)
 │    │    └── Footer (Directory links, contact email, WhatsApp direct, copyright)
 │    ├── Route: "/projects" & "/showcase" (ProjectsPage View)
 │    │    ├── Sticky Header with Logo & Navigation
 │    │    ├── Category Filter Bar (6 filter tabs)
 │    │    ├── 40+ Item Interactive Project Gallery
 │    │    ├── Project Inspection Modal (zoom, category, quote trigger)
 │    │    └── Footer
 │    └── Route: "*" (NotFound 404 View)
 └── WhatsAppButton (Sticky floating quick-quote widget: +91 8122714827)
```

### 5.1 Component Details

#### 1. `Nav.tsx` (Floating Capsule)
- Pinned at top with `fixed top-0 left-0 right-0 z-50`.
- Styled as a floating pill container: `max-w-3xl rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-5 py-2.5 shadow-xl`.
- Houses brand logo + name, anchor links (`About`, `Projects`, `Services`), and `"Start a Project"` CTA button.
- Responsive mobile drawer with smooth slide-down sheet.

#### 2. `Hero.tsx` (Cinematic Toolpath Matrix)
- Dynamic 2D HTML5 canvas rendering a continuous 3D perspective grid (`gridSize = 60`, horizon convergence at 55% screen height).
- Background video layer (`/dreamforgevideo.mp4`) running at `opacity-45` with vignette and radial overlay.
- Dynamic staggered letter animation for `DREAMFORGE` where each character fills with glass gradient at `index * 250ms`.

#### 3. `Categories.tsx` ("What We Make" & Fluid Dynamics Chamber)
- Displays the 6 core pillars of DreamForge:
  1. **Custom Prints** (`/projecthailmary.jpeg`)
  2. **Prototypes** (`/30.2.jpeg`)
  3. **Functional Parts** (`/27.1.jpeg`)
  4. **Display Pieces** (`/28.1.jpeg`)
  5. **Custom Gifts** (`/29.1.jpeg`)
  6. **Small Batches** (`/3DPrintPics/minions.jpeg`)
- **Interactive Fluid Dynamics (`FluidCanvas.tsx`):**
  - Self-contained real-time Navier-Stokes GPU fluid simulation with dual ambient Lissajous emitters (Cyan & Amber) and dynamic pointer stir interaction.
  - **Strict Section Containment:** Absolutely constrained to `#categories` with top and bottom luminous laser boundary lines (`border-t border-b border-white/15`), centered chamber pill badge, and edge fade masks ensuring zero bleeding into adjacent sections.
- **Elevated Card Architecture:**
  - Full-bleed 3D print imagery visible at 50% opacity by default with contrast gradient scrims, scaling to 85% opacity with vibrant color on hover.
  - High-contrast frosted glass containers (`backdrop-blur-xl bg-zinc-950/80 border border-white/20`), cyan specular corner sheen, glowing monospace index pills (`01`–`06`), prominent Fraunces serif titles, and animated laser accent lines on hover.

#### 4. `BentoShowcase.tsx` & `ProjectsPage.tsx`
- Bento grid with asymmetric aspect ratios (`col-span-2 row-span-2`, `col-span-1 row-span-2`, etc.).
- Complete collection of 40+ categorized projects across:
  - *Gaming & Anime*
  - *Pop Culture & Sports*
  - *Desk & Functional*
  - *Sculptures & Decor*
  - *Custom Gifts & Wearables*
- Inspection Modal: Clicking any item opens an overlay featuring the full image, category badge, and instant `"Request Print"` transfer into the quote section.

#### 5. `Order.tsx` (Project Quote Builder)
- Dual-channel enquiry pipeline:
  - **EmailJS Integration:** Automated transmission to `rehaanrafael.john@gmail.com` with client name, email, project type, and brief.
  - **Direct WhatsApp Bridge:** Pre-filled WhatsApp message generator linking to `+91 8122714827`.

---

## 6. Motion & Micro-Interactions

1. **Magnetic Cursor Follower (`CursorDot.tsx`):**
   - Follows pointer coordinates with lerp easing, scales on link/button hovers.
2. **Scroll Reveal Hook (`useReveal.ts`):**
   - IntersectionObserver triggers `.reveal` CSS classes with staggered delays (`reveal-delay-1`, `reveal-delay-2`, `reveal-delay-3`) applying upward transform and opacity fade.
3. **Card Shimmer & Borders:**
   - Soft hover lifts using `transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1)`.
   - Cyan laser hairline expansion along lower card borders on hover.

---

## 7. Technical Stack Summary

- **Core Framework:** Next.js 15 (App Router + Client SPA mounting via `src/app/[[...slug]]/client.tsx`)
- **UI Runtime:** React 18
- **Styling:** Tailwind CSS 3.4 with custom `@layer` tokens in `src/index.css`
- **Routing:** `react-router-dom` v6
- **State & Data Fetching:** `@tanstack/react-query` v5
- **Icons:** `lucide-react`
- **Notifications:** `sonner`
- **Form Communications:** `@emailjs/browser`
