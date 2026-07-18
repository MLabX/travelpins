# Current Handoff

Captured on 19 July 2026 from product commit `0b1aa0c`.

## Current Product State

- The product contains 22 Sydney coffee places.
- Seven Miles Cafe and Meisterstuck are recent team memories with local photos.
- The default list is memory-first and recent; A-Z remains available.
- `Where to next?` can choose from the personal map or find one nearby candidate.
- OpenStreetMap discovery works without a key; Google Places is an optional
  restricted-key adapter.
- The visual system is Roaming Scroll, with a typographic wordmark and no
  standalone seal.
- Desktop and mobile place photography have a generous preview and viewer.
- Mobile list and place detail states are exclusive.
- Fine-pointer motion is subtle and disabled for reduced motion.
- The full Playwright suite contains 26 passing tests at capture time.

## Branch State At Capture

- `main` -> `0b1aa0c` and deploys the product.
- `codex/archive-seal-explorations` -> `7096436` and contains rejected visual
  studies plus their rationale.
- `codex/project-memory` contains this handoff package and is not deployed.

## Known Constraints

- Personal edits live in one browser; there is no account sync.
- URL-based sharing has a practical length ceiling.
- Nearby search quality and quotas depend on the provider.
- The app is concentrated in `index.html`; this is manageable now but shared
  contracts should be extracted if feature ownership becomes unclear.
- The private source spreadsheet is not reproducible from the repository alone.
  Future imports require a fresh approved export.
- `assets/travelpins-tea-seal.png` is a legacy production-branch asset but is no
  longer referenced by the interface. Remove it only as an intentional cleanup,
  not incidentally during unrelated work.

## Product Questions Worth Testing Next

These are hypotheses, not a committed roadmap:

1. Does `Where to next?` become a repeated habit, or is direct search still the
   dominant path?
2. Do people understand the difference between `From my map` and `Somewhere new`
   without explanation?
3. Is a browser-only visit history sufficient for small circles?
4. Should saving an external candidate become a deliberate follow-up after the
   visit rather than an immediate action?
5. At what map size does URL sharing stop feeling reliable?
6. Are recent memory lines more useful than visible ratings in repeated use?

## Metrics If The Product Grows

Measure behavior before adding infrastructure:

- picker opens -> completed choices;
- personal-map choices versus nearby discovery;
- `Another one` frequency, a signal of weak first choices;
- chosen place -> map focus or directions;
- places marked visited;
- places saved after external discovery;
- search usage versus decision usage;
- share-link creation and successful save-to-map;
- provider errors and location-permission denial.

Keep analytics privacy-preserving and optional. Do not undermine the local-first
product promise merely to collect these metrics.

## Safe Next Actions

1. Verify the public GitHub Pages build after any `main` push.
2. Run the 26 Playwright tests before changing picker, popup, list, or data logic.
3. Update this handoff after the next team coffee-tour import.
4. Consider removing the unused legacy seal asset in a dedicated cleanup.
5. Consider extracting provider and persistence code only when a second real
   consumer makes the boundary valuable.

## Do Not Reopen Without New Evidence

- Naming the product after a particular recommender.
- Replacing the typographic identity with a literal seal, vessel, or cloud motif.
- Switching the entire basemap to Google solely for nearby discovery.
- Turning the picker into a wheel, slot machine, or novelty randomiser.
- Adding custom cursors, trails, particles, or decorative click ripples.
- Showing stars as the dominant signal in the main list.
