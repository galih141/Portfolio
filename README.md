# Galih Aji Arganata — Portfolio

Static brutalist/bento portfolio site. No build step, no dependencies — just HTML/CSS/JS.

## Deploy to GitHub Pages

1. Create a new repo (e.g. `portfolio`) and push these files to the root (or to `main`/`master` branch).
2. In the repo → **Settings → Pages** → Source: select your branch, folder `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Swapping in real project images

Each project card has a placeholder marked with the orange/black hazard-stripe pattern and a label like
`IMAGE PENDING — SLOT 01`. There are 5 slots total, matching the 5 work categories on the page.

**Easiest way:** open `index.html`, find the matching `<div class="media-slot" data-project-slot="N">`,
and replace its contents with an `<img>` tag:

```html
<div class="media-slot" data-project-slot="1">
  <img src="assets/project-01.jpg" alt="Short description of the image" style="width:100%;height:100%;object-fit:cover;display:block;">
</div>
```

Drop your image files into the `assets/` folder and point `src` at them (e.g. `assets/project-01.jpg`).

Recommended: 3–5 images per project category — you can duplicate a card's structure if you want
more than one image per slot (a small inner grid), just ask and I'll wire that up once you send the images.

## Structure

```
index.html      → all content/sections
css/style.css   → design tokens + layout (see :root for colors/fonts)
js/script.js    → footer year + setProjectImage() helper
assets/         → put your project images here
```
