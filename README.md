# TravelPins ☕🗺️

A lightweight, no-API-key travel map. Pin the places you've been — coffee shops, food, sights, bars — filter and search them, and **share your whole map as a single link** (no server, no account).

Built with plain HTML + [Leaflet](https://leafletjs.com) + OpenStreetMap tiles. Two files, no build step.

- `index.html` — the entire app
- `data.js` — the seed data (edit this to change what loads on first run)

Your edits are saved in the browser (`localStorage`); the seed in `data.js` is just the starting point.

---

## Run locally

Just open `index.html` in a browser. That's it.

For the share links and geocoding to behave exactly as in production, serve it over HTTP instead of `file://`:

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Deploy (pick one — all are free)

### Option A — Netlify Drop (fastest, no CLI, ~20 seconds)
1. Go to **https://app.netlify.com/drop**
2. Drag this whole folder onto the page.
3. Done — you get a live URL like `https://your-name.netlify.app`. Share links work immediately.

### Option B — GitHub Pages (version-controlled)
This repo already includes a Pages workflow (`.github/workflows/deploy.yml`).

```bash
git add -A && git commit -m "Deploy TravelPins"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Every push to `main` auto-publishes to `https://<you>.github.io/<repo>/`.

### Option C — Vercel
```bash
npx vercel --prod
```
Accept the defaults (framework: **Other**, output dir: **./**).

### Option D — any static host
Upload `index.html` + `data.js` to any web server or bucket (S3, Cloudflare Pages, GitLab Pages…). No backend required.

---

## How sharing works

The **Share this map** action encodes every pin into the URL itself (gzip → base64, using the browser's native `CompressionStream`). The map *is* the link — anyone who opens it sees your places, with a "Save to my map" option. Nothing is stored on any server.

> Note: a shared link only opens on someone else's device once the app is **hosted** (Options A–D). Opened as a local `file://`, links only work on your own machine.

## Editing the seed data

Open `data.js` and edit the `window.TRAVEL_PINS` array. Each entry:

```js
{ name: "Blue Bottle Coffee", city: "Tokyo", category: "coffee",
  lat: 35.6659, lng: 139.7085, rating: 5, notes: "Pour-over heaven.",
  image: "https://…" /* optional */ }
```

Categories: `coffee`, `food`, `sight`, `bar`, `other`. You can also **Import** a JSON/CSV or drag one onto the map.
