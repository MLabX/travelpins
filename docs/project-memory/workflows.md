# Working Workflows

These workflows are the reusable part of the project's experience. They are
project-specific defaults, not universal rules for every future product.

## 1. New Codex Session

1. Read `AGENTS.md` and `PROJECT_MEMORY.md`.
2. Run `git status --short`, `git branch -vv`, and `git log -5 --oneline`.
3. Read the files relevant to the request before proposing changes.
4. Run the existing Playwright suite to establish a baseline when the task can
   affect behavior or layout.
5. Keep unrelated or user-owned working-tree changes intact.

Do not begin by redesigning from screenshots alone. The implementation, design
constitution, and tests jointly define the current product.

## 2. Product Feature Refinement

Use this sequence when a suggestion arrives:

1. **Extract the human job.** What frustration or desire sits under the proposed
   feature?
2. **Test product fit.** Does it strengthen personal memory, trusted choice,
   privacy, or warmth?
3. **Check provenance.** Is the result from the user's map or an external source?
4. **Reduce the surface.** Find the shortest flow that completes the job.
5. **Define failure states.** Empty data, denied location, network failure,
   repeated results, and no eligible place all need humane outcomes.
6. **Implement with existing patterns.** Preserve static hosting unless the need
   truly requires a service.
7. **Encode the product contract in Playwright.** Test meaning and state, not only
   happy-path clicks.
8. **Update decisions only if the product rule changed.**

Example: `Spin the Wheel` became `Where to next?` after retaining the decision job
and removing the novelty metaphor.

## 3. Visual And Copy Change

1. Re-read `docs/design/constitution.md` and `voice-and-copy.md`.
2. Name the visual role of every new colour, image, type style, and motion.
3. Check whether the same job already has an established token or component.
4. Prefer spacing, hierarchy, and better content before adding a container.
5. Keep one dominant action per view.
6. Verify text-safe space against imagery at real viewport sizes.
7. Capture screenshots at:
   - 1280 x 900 desktop;
   - 800 x 900 narrow desktop;
   - 390 x 844 regular phone;
   - 320 x 568 short phone.
8. Inspect open and closed popups, long notes, two-photo galleries, keyboard focus,
   touch targets, and reduced motion.
9. Add or update Playwright geometry checks.
10. Save a reference screenshot only after the direction is accepted.

### Copy filter

For each line ask:

- Does the interface already say this?
- Does it sound like a warm, observant friend?
- Is it a human reason to return rather than a feature claim?
- Can it lose three words without losing warmth?
- Is the UI still entirely English?

## 4. Image Research And Generation

1. Establish the semantic job: identity, place evidence, journey, or atmosphere.
2. Research authoritative originals and design references before generating.
3. Extract principles such as proportion, negative space, colour relationship,
   line quality, and material behavior.
4. Do not combine literal cultural symbols into a generic heritage collage.
5. Generate or source a bitmap only when it has a clear production location.
6. Test it in the actual interface at final crop ratios.
7. Reject assets that need explanatory language to justify their fit.
8. Archive substantial rejected studies on a non-product branch with rationale.

The seal archive is a negative reference: it shows why a culturally suggestive
shape can still fail the product's proportions and tone.

## 5. Importing A New Coffee Dataset

1. Keep the private workbook or authenticated source outside Git.
2. Export a reviewable CSV and inspect headers, missing fields, duplicates, date
   formats, score ranges, and address quality.
3. Preserve the current seed record contract in `data.js`.
4. Map source scores out of ten to display stars consistently; retain the original
   score in `score` and practical detail in `notes`.
5. Derive `whyGo` and `skipIf` from actual field notes. Do not manufacture praise.
6. Keep `city` and `area` semantically distinct.
7. Verify coordinates against addresses and map placement.
8. Add local photos only with approval; use concise, date-based filenames.
9. For a new shared visit, set `visitedAt` and a stable `updateKey`.
10. Increment `TRAVEL_PINS_VERSION` and test migration from an older saved map.
11. Search the codebase for personal branding that should not enter the generic UI.
12. Run all tests and inspect the first recent rows in the browser.

## 6. Adding Or Changing A Nearby Provider

1. Preserve the `From my map` / `Somewhere new` separation.
2. Request geolocation only after an explicit user action.
3. Ask for the smallest provider field set needed for one result.
4. Filter candidates already present in the personal map.
5. Cache candidates for the open picker session.
6. Show attribution and an external directions action inside the result.
7. Do not persist a candidate until the user intentionally saves it.
8. Cover permission denial, network failure, empty results, duplicates, and mobile
   layout in Playwright.
9. Document key restrictions, billing assumptions, and provider policy.

Do not replace Leaflet merely to obtain place search. The basemap and discovery
provider are separate decisions.

## 7. Responsive Popup Or Sidebar Change

1. Identify the owning state: map, list sheet, place detail, picker, or photo
   viewer.
2. On mobile, allow only one foreground owner.
3. Make non-owning controls visually and interactively yield.
4. Use dynamic viewport units and safe-area insets where browser chrome matters.
5. Keep long content internally scrollable.
6. Wait for transitions to settle before asserting geometry.
7. Test rotation-like resize by narrowing an already open popup.
8. Verify focus return and close behavior.

## 8. Playwright Review

Run:

```bash
npm ci
npm run test:browser
```

For visual review, use a local HTTP server and Playwright screenshots. Inspect the
image, not only the exit code. Good assertions include:

- no page overflow;
- popup inside viewport;
- list sheet fully gone in mobile detail state;
- source attribution visible and correctly scoped;
- actions inside short viewports;
- hierarchy order and compact dimensions;
- touch and reduced-motion behavior;
- seed migration exactly once.

When a test fails, first decide whether the product regressed, the test observed
an intermediate animation state, or the product rule intentionally changed.

## 9. Commit, Deploy, And Verify

1. Run `git diff --check` and review `git diff --stat`.
2. Stage only intended files; keep rejected research and private source files out.
3. Run Playwright.
4. Commit with a product-level message.
5. Push `main` only when the change should deploy.
6. Confirm the remote branch points to the local commit.
7. Check GitHub Pages after the workflow completes.
8. For research that should not ship, use a clearly named `codex/archive-*`
   branch and do not open a merge PR.

## 10. Independent Review When A Named Tool Is Unavailable

1. Check whether the requested reviewer is actually callable and authenticated.
2. If access would require unavailable enterprise permission, do not block.
3. Perform a fresh review without defending the current solution:
   - restate the user job;
   - identify the strongest alternative;
   - list ambiguity, failure, and accessibility risks;
   - compare against the constitution and observed screenshots;
   - recommend the smallest high-confidence revision.
4. State honestly that this is an independent internal review, not the named
   external review.
