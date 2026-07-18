# TravelPins Agent Guide

Read [PROJECT_MEMORY.md](PROJECT_MEMORY.md) before making product, visual, data,
or deployment changes. It is the index to the project's distilled history and
working practices.

## Product In One Sentence

TravelPins is a private-by-default personal map that helps someone remember and
choose places worth returning to. It is not a public venue directory or a Google
Maps replacement.

## Non-Negotiable Product Rules

- Keep the runtime static, account-free, and useful without a paid API key.
- The map stores personal memory; external discovery is transient and sourced.
- Keep all product UI copy in English, short, warm, and human.
- Do not use a person's name as the brand or recommendation authority.
- Preserve the distinction between a city and its areas or suburbs.
- Treat mobile list and place-detail states as mutually exclusive.
- Do not add literal heritage motifs merely to signal a Chinese influence.
- Do not merge rejected seal assets from `codex/archive-seal-explorations`.

## Before Editing

1. Read [docs/design/constitution.md](docs/design/constitution.md).
2. Read the relevant section of
   [docs/project-memory/workflows.md](docs/project-memory/workflows.md).
3. Inspect the current implementation; most behavior lives in `index.html`.
4. Preserve user changes in `localStorage` when changing seed data.
5. For visual work, test at desktop, narrow desktop, regular phone, and short
   phone sizes.

## Verification

```bash
npm ci
npm run test:browser
```

The Playwright suite is a product contract. Update it when a deliberate product
decision changes, not merely to silence a regression.

## Important Branches

- `main`: deployable product; every push triggers GitHub Pages.
- `codex/project-memory`: complete handoff and accumulated project knowledge.
- `codex/archive-seal-explorations`: rejected visual studies, retained only as
  research history.

## Source Of Truth

- Product and visual rules: `docs/design/`
- Project history and lessons: `docs/project-memory/`
- Seed place data: `data.js`
- Runtime behavior and styles: `index.html`
- Browser contract: `tests/travelpins.spec.js`
- Deployment: `.github/workflows/deploy.yml`
