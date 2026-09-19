# juminwho

One-page personal site for Jumin Cho, AI researcher and Ph.D. student at Jeonbuk National
University. Live at <https://jumincho.github.io/juminwho/>.

## Stack

Vite 7 · React 19 · TypeScript · CSS Modules with design tokens. No router, no CMS, no
backend. Content is plain data in `src/data/profile.ts`.

## Develop

```bash
npm ci
npm run dev      # http://localhost:5173
npm run lint
npm run build    # outputs dist/
```

## Update content

Edit `src/data/profile.ts`. Everything on the page (roles, education, publications, links,
birth date for the live age counter) is read from that file. Design rules are in
[`docs/DESIGN.md`](docs/DESIGN.md); tokens are in `src/styles/tokens.css`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes
it with the GitHub Pages Actions deployment. The repository's Pages source must be set to
**GitHub Actions** (Settings → Pages → Build and deployment).
