# Lemonade

Health record website for Lemonade, a male Golden Retriever born 16 November 2019. It covers his seizure log, medications, vet visits, conditions, imaging and day-to-day care, for sharing with vets, dog sitters, friends and family.

Built with [Astro](https://astro.build) and [D3](https://d3js.org), deployed to GitHub Pages. The whole site sits behind a PIN.

> The PIN is a soft gate. It keeps casual visitors and search engines out of the site, but everything in this repository is public on GitHub.

## Updating the record

Structured records are YAML files in `src/data/`. Longer write-ups are Markdown files in `src/content/`. Stats, charts and "days since" counts are worked out automatically.

| To record… | Edit |
|---|---|
| A seizure | `src/data/seizures.yaml` — add an entry at the top. For a second seizure within 24 hours, set `cluster_with` |
| Warning signs (prodrome) | `src/data/prodromes.yaml` — log every episode, even if no seizure follows |
| A vet visit | Add a Markdown file to `src/content/visits/` (copy an existing one), and a line to `src/data/timeline.yaml` |
| Medication changes or reminders | `src/data/medications.yaml` |
| A weigh-in | `src/data/weight.yaml` — a chart appears once there are two |
| A scan or X-ray | Add a Markdown file to `src/content/imaging/`; put images in `public/images/` |
| Conditions | `src/content/conditions/` |
| Action plan, diet, exercise, physio, background | `src/content/pages/` |
| Gaps or things to check | `src/data/open-questions.yaml` |

Unknown values use `{{TBD}}`. In Markdown, link to other pages with site paths such as `/seizures/`, and use `> [!warning]`, `> [!note]`, `> [!tip]` or `> [!important]` for callout boxes.

## Running it locally

```sh
npm install
SITE_PIN=1234 npm run dev     # http://localhost:4321/lemonade/
```

Leave out `SITE_PIN` to run without the PIN screen.

## Publishing

Every push to `main` builds and deploys the site. One-time setup in the repository settings:

1. **Make the repository public** (GitHub Pages is free for public repositories).
2. **Settings → Pages → Source:** choose **GitHub Actions**.
3. **Settings → Secrets and variables → Actions:** add a secret called `SITE_PIN` containing the PIN. The deploy fails without it, so the site is never published unprotected.

The site will be at `https://vickerslewis.github.io/lemonade/`.
