# CaramOS Landing Page

Vite + React bilingual landing page for CaramOS, ready for Cloudflare Pages.

- Default language: Vietnamese
- Secondary language: English
- Stack: Vite, React, vanilla CSS

## Local development

```bash
yarn install
yarn dev
```

## Production build

```bash
yarn build
yarn preview
```

## Cloudflare Pages deploy

This project includes `wrangler.json` for Cloudflare Pages.

Recommended Pages settings:

- Framework preset: `Vite`
- Build command: `yarn build`
- Build output directory: `dist`
- Install command: `yarn install --frozen-lockfile`
- Root directory: repository root of this landing project
- Node.js version: `20`

### Deploy from Cloudflare Dashboard

1. Push this landing project to GitHub.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages**.
3. Connect the GitHub repository.
4. Use the settings above and deploy.

### Deploy from CLI

```bash
yarn build
npx wrangler pages deploy dist --project-name caramos-landing
```

If using this folder directly from the CaramOS workspace, the folder is also mapped at:

```text
/home/dungleviet/Documents/CaramOS/landing
```
# caramos-landing
# caramos-landing
