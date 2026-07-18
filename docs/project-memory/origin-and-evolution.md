# Origin And Evolution

## Why The Project Began

TravelPins began as a small hackathon-style static map for saving and sharing
places. The first prototype was deliberately simple: plain HTML, Leaflet, dummy
places from several world cities, browser storage, and shareable URL state. Its
technical promise was compelling, but its product identity was generic.

The project became real when the team started taking coffee-shop walks around
Sydney and supplied genuine field notes, ratings, prices, addresses, and group
photographs. That changed the question from "How do we display pins?" to:

> How do we preserve the places and moments we would genuinely want to find
> again, and make the next choice easier?

The answer is the current product thesis: a personal atlas of remembered places,
not another universal search engine.

Private spreadsheet exports were used as working source material but were not
committed. The public repository contains the transformed place records and
approved photographs only. No private SharePoint link, personal API key, or raw
source workbook should be added to Git.

## Product Evolution

### 1. Generic travel map

Commit `627773c` created a static, no-account map with dummy global places,
category filters, editing, import/export, and link-based sharing. It proved that
a useful product could run without a backend or build step.

What it lacked was a reason to exist beside established maps.

### 2. Real Sydney coffee notes

Commit `c8fce7a` replaced the illustrative data with the team's actual Sydney
coffee list and the first group visit photograph. The interface initially leaned
too heavily on one colleague's reputation. Product review concluded that a named
"approved" coffee list was narrow, hard to generalise, and dependent on a person
who was not the product.

The data may come from a trusted person or circle, but the interface is generic:
every user owns their map and judgment.

### 3. City and area are different concepts

Commit `fae6762` separated `city` from `area`. Sydney, Haymarket, Surry Hills,
Darlinghurst, and CBD must not be counted as five cities. The UI now reports areas
when all places share one city and retains a data model that can support multiple
cities later.

Lesson: display labels should follow geographic semantics, not whatever string
happened to be imported.

### 4. From directory to personal memory

The Google Maps comparison forced a sharper differentiation. Google Maps is
excellent at exhaustive discovery, routing, business facts, and public reviews.
TravelPins should be better at remembering why a place mattered to one person or
small circle and making one trusted choice.

This led to:

- reasons to return (`whyGo`) rather than generic descriptions;
- visit dates and group photographs;
- a recent-memory section instead of a ranking-first list;
- ratings remaining in details rather than dominating the index;
- warm, personal language instead of authority or recommendation-engine claims.

### 5. A decision tool, not a novelty wheel

A teammate suggested "Spin the Wheel" to choose an unvisited place under some
constraints. The underlying need was strong: stop discussing and choose where to
go. The casino metaphor was not. It would turn a useful decision into a gimmick
and weaken trust when the result was unsuitable.

The idea was refined into `Where to next?`: a short flow that asks for relevant
intent and returns one answer. The personal-map path can prefer places worth
returning to, avoid visited places, or favour somewhere suitable for sitting.
The result explains why it fits and allows another choice without presenting an
endless shortlist.

### 6. Memory and discovery became explicit sources

"Somewhere new" originally risked implying knowledge TravelPins did not have. It
now means a place not already present on this TravelPins map. The picker clearly
separates:

- `From my map`: personal data, trusted and persistent;
- `Somewhere new`: transient nearby candidates from an attributed provider.

OpenStreetMap Nominatim is the zero-key default. A restricted Google Places key
can opt into richer provider data without changing the product flow. Search
results are cached only for the open picker session and are not silently added to
the map.

### 7. Roaming Scroll visual language

Early versions cycled through coffee brown, terracotta, lime, dark green, and
generic product-dashboard styling. The colours competed, controls felt unrelated,
and several generated logo experiments looked like app icons, lamps, mazes, or
literal heritage decoration.

Research into Chinese blue-green landscape painting and Dunhuang mineral colour
relationships produced a better rule: take rhythm, negative space, material
colour, and human scale rather than copying motifs. This became the project-
specific `Roaming Scroll` language.

The final system uses:

- paper for reading surfaces;
- malachite for primary actions;
- azurite for direction and wayfinding;
- cinnabar for places and rare focal marks;
- ochre for ratings;
- a typographic wordmark instead of a forced seal.

The header uses a distant ridge and the decision action uses a waterway so the two
prominent surfaces do not repeat one picture. Rejected seal studies are preserved
on `codex/archive-seal-explorations` with their rejection rationale.

### 8. Photography and mobile detail ownership

Real group photographs proved more valuable than decorative imagery, but early
popups made them too small to inspect. Place details now give photography a
generous preview and an immersive viewer.

On mobile, the map popup and bottom-sheet list initially overlapped, sometimes
with browser chrome and map controls competing as well. The mature rule is state
exclusivity: when place detail is open, the list exits and map controls yield.
Long detail content scrolls inside the popup.

Commits `ee206e1` and the corresponding Playwright tests encode this behavior.

### 9. A calmer main index

The sidebar hierarchy was reconsidered as a product flow:

1. Brand and product promise.
2. Small map statistics.
3. `Where to next?`, the distinctive decision action.
4. Search, a quieter retrieval utility.
5. Recent place memories and the rest of the map.
6. `Save a place`, a persistent secondary action.

The list now defaults to recent activity, then separates `More from your map`.
Alphabetical order remains explicit. Each row shows place, area/category, visit
context, and one human reason to return; stars remain in details.

### 10. Motion as material response

The project considered adding a themed cursor. Deeper review rejected custom
cursors, trails, particles, and click ripples as decorative and potentially
inaccessible. The implemented motion is local and semantic:

- journey artwork reveals slightly under a fine pointer;
- place dots and map pins answer with a quiet cinnabar ring;
- selection settles with a short cinnabar stroke;
- touch and reduced-motion modes remain still.

## Commit Timeline

| Commit | Date | Milestone |
| --- | --- | --- |
| `627773c` | 2026-07-10 | Static TravelPins v0.5 prototype |
| `c8fce7a` | 2026-07-13 | Real Sydney coffee data and first team memory |
| `fae6762` | 2026-07-13 | Future-proof city and area model |
| `3255acb` | 2026-07-17 | Roaming Scroll direction, Seven Miles visit, Playwright foundation |
| `c6b4b21` | 2026-07-18 | Personal-memory index, photography, and richer picker |
| `ee206e1` | 2026-07-18 | Mobile place-detail layering fix |
| `0b1aa0c` | 2026-07-19 | Dual-source picker, refined hierarchy, motion, design documentation |
| `7096436` | 2026-07-19 | Rejected seal studies archived on a non-product branch |
