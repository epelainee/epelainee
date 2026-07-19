# Pages CMS for editable site content

## Goal

Make categories, subcategories, experiences, and site chrome editable by an
admin without touching React code — via **Pages CMS** (git-based) editing JSON
files in this repo. Keep the existing Vite / React / R3F app (no Astro).

## Decisions

- **CMS:** Pages CMS (`.pages.yml` + GitHub)
- **Site:** Vite / React (unchanged architecture)
- **Storage:** separate JSON files under `content/`
- **Delivery:** build-time import (`import.meta.glob`); site updates on redeploy
- **Removed:** Sanity Studio, runtime CDN fetch, Sanity seed script

## Content layout

| Path | Shape |
| --- | --- |
| `content/categories/{id}.json` | `id`, `label`, `order` |
| `content/subcategories/{id}.json` | `id`, `label`, `order`, `category` (category id) |
| `content/experiences/{id}.json` | experience fields + `order` + `subcategory` id; category derived at load |
| `content/site-settings.json` | chrome, meta, placeholders, hub tips |

## App integration

- `src/data/loadSiteContent.ts` — glob JSON, sort, nest, export `SiteContent`
- Sync `ContentProvider` (no async loading flash)
- Types stay in `src/data/*.ts`; large arrays move out of TS into `content/`

## Admin flow

1. Connect the GitHub repo in [Pages CMS](https://pagescms.org)
2. Edit via UI → commits to GitHub
3. Redeploy / rebuild the site

## Out of scope

- Runtime live updates without rebuild
- Astro migration
- Images / rich text bodies
