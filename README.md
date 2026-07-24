# Portwebsite

Galih Aji Arganata's live portfolio site — static, brutalist, bento layout. Reads project data from `projects.json` at runtime, so adding new work never means editing HTML.

## Files

- `index.html` — hero, work section (filter tabs + grid), contact, lightbox markup
- `style.css` — all styling
- `script.js` — fetches `projects.json`, renders the grid, filters by category, powers the lightbox
- `projects.json` — the actual project data (starts as an empty array `[]`)
- `projects/` — folder where each project's images live, one subfolder per project

## How it connects to Writeport

This repo doesn't need to be edited by hand to add a new project. Instead:

1. Open **writeport** (the separate content-builder tool) on your computer
2. Fill in a project, add images, repeat for as many as you want
3. Click **Export ZIP**
4. Extract the ZIP and drag its contents into this repo's root — it will contain an updated `projects.json` and a `projects/<id>/` folder per new project
5. Commit and push

The site will automatically pick up the new projects on next load — no HTML editing required.

## Testing locally

Because the site uses `fetch('projects.json')`, opening `index.html` directly by double-click (`file://...`) will usually **fail silently** — browsers block `fetch` on local files for security reasons. To preview changes locally, run a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (This is only needed for local testing — once pushed to GitHub Pages, `fetch` works normally since it's a real server.)

## Deploying to GitHub Pages

1. Push this repo to GitHub (repo name doesn't matter, e.g. `portwebsite`).
2. Go to **Settings → Pages**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — your site goes live at `https://<username>.github.io/<repo-name>/` within a minute or two.

## projects.json schema

Each entry looks like this (this is exactly what Writeport generates):

```json
{
  "id": "skincare-bottle-hero-render",
  "title": "Skincare Bottle — Hero Render",
  "category": "visualization",
  "description": "A short 3-5 sentence description of the project.",
  "images": [
    "projects/skincare-bottle-hero-render/img-01.jpg",
    "projects/skincare-bottle-hero-render/img-02.jpg",
    "projects/skincare-bottle-hero-render/img-03.jpg"
  ]
}
```

`category` must be one of: `visualization`, `mockup`, `element` — these map to the filter tabs on the site. The first image in the `images` array is used as the card's cover thumbnail.

## Editing the hero / contact text

The hero bio, stats, WhatsApp number, email, and links (IMDb, Fastwork) are hardcoded in `index.html` — they don't come from `projects.json`. Edit them directly in the file if any of that info changes.

## Things to double check before going live

- WhatsApp link uses `+62 856 497 363 24` → `https://wa.me/6285649736324`. Confirm this is correct and reachable.
- Fastwork link: `https://fastwork.id/user/galih141/3d-animation-23440449`
- IMDb link: `https://www.imdb.com/name/nm11562163/`
