# The Great British Write-Off: Technical Specification (v2)

## 1. Overview

**Product:** UK student loan repayment calculator with a distinct 1940s/50s London Underground design aesthetic.

**Primary Goal:** A high-quality **public portfolio asset** demonstrating Senior Fullstack engineering skills (React, Architecture, Clean Code) while generating passive ad revenue.

**Target Audience:** UK students and graduates (Plan 2, Plan 4, Plan 5).

**Distribution Model:** Free tool, open source (GPLv3/Source Available), ad-supported.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18+ (Vite)
- **Build**: Bun, Vite
- **Language:** TypeScript
- **Hosting:** Firebase Hosting
- **Styling:** Tailwind
- **State Management:** Zustand

### Backend / Services (Serverless)
- **Database:** Cloud Firestore (NoSQL)
- **Functions:** Cloud Functions (Node.js)
- **Storage:** Cloud Storage (For generated share images)
- **Scheduled Jobs:** Cloud Scheduler (TTL data cleanup)

### Image Generation
- **Library:** `sharp` (Node.js)
- **Method:** SVG Template → PNG rendering on the fly/background
- **Optimization:** Images cached in Cloud Storage and served via Firebase Hosting rewrites

---

## 3. Core Features

### 3.1 Calculator Form (Input)
- **Undergraduate:** Plan 2, Plan 4, Scotland.
- **Inputs:** Start year (2006–2020), Course length, Loan amounts.
- **Income Projection:** 30-year slider interface.
  - *Interaction:* "Ripple update" (changing year $X$ updates $X+1...$ unless locked).
  - *Inflation:* Optional "Auto-adjust" toggle (CPI + X%).

### 3.2 Results Page
- **Headline:** High-impact text ("NOPE" / "YES") + key figures.
- **Visuals:**
  - **Tube Map Graph:** Loan balance over time (Angular lines, Beck-style).
  - **Tunnel Chart:** Stacked area (Interest vs Principal).
- **Ad Placement:** Single mobile-friendly banner (320x100) positioned between Headline and Charts.

### 3.3 Shareable Results (Socials)
- **Mechanism:** User clicks "Share" → Generates `thegreatbritishwriteoff.co.uk/r/abc123`.
- **Privacy:** No PII stored. Anonymous scenario ID only.
- **Social Card:** Server-generated Open Graph image (PNG) showing "Write-off in X Years".
- **TTL:** Links/Docs auto-expire after 180 days via Cron.

### 3.4 Data & Rulesets
- **Source of Truth:** JSON files stored in the public repo (`/rulesets/uk/`).
- **Transparency:** "Methodology" page linking to the GitHub repo rulesets.

---

## 4. Architecture & Security (Public Repo)

Since the code is public, security and secrets management are critical.

### 4.1 Secrets Management
- **Local Dev:** `.env.local` (git-ignored).
- **CI/CD:** GitHub Secrets (injects into build process).
- **Runtime:** Firebase Environment Config (`.env` files managed via Firebase CLI, not committed).
- **Golden Rule:** **NEVER commit API keys, Service Account JSON, or Admin SDK credentials.**

### 4.2 Data Privacy (GDPR)
- **Share Links:** Store only scenario inputs (math variables). No IP, no User Agent, no Email.
- **Analytics:** Plausible or GA4 (Anonymized IP).
- **Email List:** Double opt-in via external provider (Buttondown/Mailchimp).

---

## 5. Licensing & IP Strategy

To protect the asset while using it for your portfolio:

### 5.1 Code License
**Recommended:** **GNU GPLv3**
*   **Effect:** If anyone clones your code to release their own version, *their* code must also be open source.
*   **Why:** This is a strong deterrent for commercial copycats while keeping the code open for recruiters/engineers to inspect.

### 5.2 Data License
**License:** **CC-BY-SA 4.0** (Creative Commons Attribution-ShareAlike).
*   Allows others to use the `rulesets/` JSON.
*   Requires them to credit "The Great British Write-Off" (SEO backlink benefit).

---

## 6. Repository Structure

This structure is designed to be clean, professional, and hide nothing except secrets.

```text
/
├── .github/workflows/    # CI/CD pipeline (Deploy to Firebase)
├── functions/            # Backend (Node.js)
│   ├── src/
│   │   ├── generateImage.ts  # OG Image generator (Sharp)
│   │   ├── createResult.ts   # Share link handler
│   │   ├── cleanup.ts        # TTL deletion job
│   │   └── ...
│   └── package.json
├── public/               # Static assets (Favicon, Robots.txt)
├── rulesets/             # The Open Data (JSON)
│   └── uk/
│       ├── 2025-26.json
│       └── schema.json
├── src/                  # React Frontend
│   ├── components/       # UI (Calculator, Charts, etc.)
│   ├── lib/              # Core Math Logic (The "engine")
│   ├── pages/            # Next.js/Router pages
│   ├── styles/           # CSS Modules / Global styles
│   └── App.tsx
├── .env.example          # Template for env vars (safe to commit)
├── .gitignore            # Excludes .env.local, node_modules
├── firebase.json         # Hosting/Functions config
├── firestore.rules       # Database security rules
├── LICENSE               # GPLv3
├── README.md             # Project docs, setup, tech stack
└── vite.config.ts        # Build config
```

---

## 7. Roadmap

### Phase 1: MVP & Portfolio Launch
- Build core calculator logic & UI.
- Implement anonymous share links.
- Open source the repo with documentation (`README.md`, `CONTRIBUTING.md`).
- **Goal:** Use in interviews, post on LinkedIn/GitHub to boost personal brand.

### Phase 2: Traffic & SEO
- Launch site to relevant subreddits (e.g., /r/UKPersonalFinance).
- Add "Methodology" page linking back to the GitHub repo (Trust signal).
- Turn on AdSense/Ad unit once traffic hits ~1k visits.

### Phase 3: Maintenance & Passive Income
- Annual update of `rulesets/` JSON (every April).
- Optional: Add "Sponsor this project" link or "Buy me a coffee".
- Monitor Cloud Functions costs (ensure image generation isn't abused).