# JUMIN CHO — Portfolio

Personal portfolio site for **Jumin Cho (조주민)** — AI Researcher · Ph.D. Student @ Jeonbuk National University.

🔗 **Live:** https://jumincho.github.io/juminwho/

A cinematic single-page landing (with an FC-Online–style "pack opening" intro) plus a CV, project gallery, and a research blog. Built with **React 19 + TypeScript + Vite**; the blog and travel data are backed by Supabase with local fallbacks.

## Tech stack

- **React 19**, **TypeScript** (strict), **Vite 7**
- **framer-motion** — scroll-driven + spring animation
- Raw **WebGL / GLSL** — the hand-written shader background
- **react-router 7**, **react-markdown** + **KaTeX** (blog), **mapbox-gl** (travel globe)
- **Supabase** — blog posts, travel spots, admin auth

## Structure

```
src/
  pages/         Home, Projects, ProjectDetail, CV, Blog, BlogPost, BlogWrite
  components/
    landing/     Hero, Marquee, Journey timeline, Footer
    intro/       FC-Online pack-opening intro
    …            ShaderBackground, Cursor, TiltCard, MagneticButton, ScrambleText, LiveAge
  data/profile.ts  single source of truth for personal info
public/intro/    intro assets (flag, crest, card)
supabase/        schema.sql + seed SQL
```

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check (tsc -b) + production build
npm run lint
```

## Deploy

GitHub Pages serves the **`gh-pages`** branch (Settings → Pages → *Deploy from a branch* → `gh-pages` / `root`).
On push to `main`, `.github/workflows/deploy.yml` builds the site and publishes `dist/` to `gh-pages`.

## Supabase setup

1. Copy `.env.example` to `.env.local` and fill `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL editor.
3. Create one admin user in Supabase Auth and set `VITE_ADMIN_EMAIL` to that email.

**With Supabase configured** — blog posts read from `posts`, travel spots from `travel_spots`, admin login uses Supabase auth, and paper figures should be uploaded to Storage `blog-images/papers/` (reference the public URLs in post content).

**Without Supabase** — blog posts fall back to `src/data/posts.ts` and travel spots to browser `localStorage`.
