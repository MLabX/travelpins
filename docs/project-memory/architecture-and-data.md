# Architecture And Data

## Technical Shape

TravelPins is intentionally a static application:

- `index.html` contains markup, CSS, and runtime JavaScript.
- `data.js` contains the seed map.
- Leaflet renders the map; CARTO-hosted OpenStreetMap tiles provide the basemap.
- Browser `localStorage` stores personal edits and picker state.
- Share links serialise the complete map into the URL.
- GitHub Pages deploys `main` without a build step.
- Playwright exercises product, responsive, accessibility, and provider behavior.

This architecture is a product property, not merely an implementation shortcut.
It keeps hosting cheap, setup simple, and personal data off a server. Add a
backend only when a validated product need cannot be met locally.

## Runtime Map

Important regions of `index.html`:

| Concern | Main functions or objects |
| --- | --- |
| Seed and persistence | `normalizePin`, `seedData`, `loadData`, `saveData`, `mergeSeedFields` |
| Decision state | `loadPickState`, `savePickState`, `recordPicked`, `setVisited` |
| Personal picker | `pickEligible`, `pickWeight`, `choosePlace`, `explainPick` |
| Nearby discovery | `fetchGoogleNearby`, `fetchOsmNearby`, `discoverNearby`, `chooseDiscovery` |
| Map and list | `getMarker`, `drawMarkers`, `drawList`, `render`, `focusPin` |
| Place editing | `openModal`, form submit handler, `removePin`, `parseCSV` |
| Responsive popup | `syncResponsivePopup`, popup layout helpers |
| Photos | `popupPhotos`, `openPhotoViewer`, `renderPhotoViewer` |
| Sharing | `slimPins`, `fatPins`, `encodeMap`, `decodeMap`, `checkSharedLink` |

There is no framework lifecycle. `render()` is the central redraw boundary.
Keep changes close to the existing ownership region unless complexity genuinely
requires a new module.

## Place Data Contract

The effective record shape is:

```js
{
  id,             // runtime identity
  name,
  city,           // municipality or city
  area,           // suburb, district, neighbourhood, or CBD
  category,       // coffee | food | sight | bar | other
  lat, lng,
  rating,         // display stars, 0-5
  notes,          // full field note and practical details
  image, images,  // optional local or remote photography
  recommended,    // trusted personal recommendation flag
  score,          // original 0-10 source score when available
  traits,         // decision-relevant facts, not decorative tags
  whyGo,          // concise human reason to return
  skipIf,         // honest mismatch warning
  visitedAt,      // ISO date
  addedAt,
  updatedAt,
  updateKey       // stable seed-migration identity for special additions
}
```

`city` and `area` must remain separate. Do not encode `CBD` as a city. Statistics
may display areas when all visible places share one city.

## Seed Data And Personal Data

`data.js` is only the starting map. Once a user edits the map, their copy lives in
`localStorage` under `travelpins.v2`.

Changing seed data must not erase those edits. The current migration model uses:

- `window.TRAVEL_PINS_VERSION` to identify the seed generation;
- stable `updateKey` values for special seed additions;
- `mergeSeedFields` to enrich matching saved records;
- `travelpins.v2.seedUpdates` to prevent a seeded visit from being added twice.

When adding a new team visit:

1. Give it an ISO `visitedAt` date.
2. Add local photographs under `assets/`.
3. Give it a unique, durable `updateKey`.
4. Increment `TRAVEL_PINS_VERSION`.
5. Add a test proving existing maps receive it exactly once.

## Sorting And Activity

Default `Recent` order uses the best available activity date:

1. local visited date from picker state;
2. seed `visitedAt`;
3. `addedAt`.

Places with recent activity lead. Remaining records appear under `More from your
map`. `A-Z` is an explicit alternate mode and removes the date section.

## Personal Picker Logic

The picker is intentionally constrained, not random in the pure sense.

- Eligibility applies selected constraints.
- `recommended` is a system promise for the personal-map source, not a visible
  checkbox asking the user whether quality matters.
- Recent picks receive less weight so repetition is less likely.
- Visited state can be excluded when `Somewhere new` within the personal map is
  selected.
- Sit-down suitability comes from traits such as `Sit down` or `Roomy`.
- The result gives one reason and, when relevant, one honest caveat.

The picker state is local to the browser. It does not claim to know the user's
complete real-world visit history.

## Nearby Provider Contract

The nearby path requests location only after an explicit action.

Default provider:

- OpenStreetMap Nominatim;
- bounded nearby search;
- one request followed by in-session reuse;
- source attribution shown in the result.

Optional provider:

- Google Places API (New);
- configured through `window.TRAVELPINS_GOOGLE_MAPS_KEY` before the app script;
- key must be HTTPS-referrer restricted and Places-only;
- request only identity, address, location, type, and Maps URL fields;
- Google results remain transient and show compliant `Google Maps` attribution.

Provider candidates are filtered against the personal map using normalised name
and proximity. External search must not silently persist a place.

## Sharing

`slimPins` maps records to compact keys, then `encodeMap` uses the browser's
compression APIs and URL-safe base64. The URL fragment contains the map. Opening
a shared map does not overwrite local data until `Save to my map` is chosen.

This is elegant for modest maps but URL length is a real limit. If the product
grows to hundreds of places or high-resolution embedded data, sharing is the
first architectural area likely to need a backend or file-based alternative.

## Deployment

`.github/workflows/deploy.yml` publishes the repository root whenever `main` is
pushed. Memory and archive branches do not deploy. The expected public URL is:

`https://mlabx.github.io/travelpins/`

Never commit a browser API key. A deployment-specific key should be injected by a
hosting layer or a controlled configuration step and restricted at the provider.
