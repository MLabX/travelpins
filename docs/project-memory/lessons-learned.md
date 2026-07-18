# Lessons Learned

## Product Lessons

### A real dataset changes the product

Dummy data made the prototype look broad but emotionally empty. Real notes and
group photographs revealed the valuable unit was not the business listing; it
was the remembered reason to return. Use real behavior early.

### Do not borrow a product identity from one contributor

A trusted colleague can seed quality, but a product branded around that person's
approval cannot naturally become every user's personal map. Preserve provenance
in the data process, not as permanent UI authority.

### Differentiate by choosing what not to compete on

TravelPins should not out-search Google Maps. It can be calmer, more personal,
more private, and better at returning one meaningful answer from a small trusted
set. Every feature should reinforce that asymmetry.

### A suggestion often contains a better need than its proposed form

"Spin the wheel" contained the need to end indecision. Keeping the need while
discarding the game metaphor produced a stronger picker. Ask what job the idea is
trying to do before implementing its surface form.

### Provenance is part of the interaction

Personal memory and public discovery have different trust, privacy, and
persistence. Hiding that difference would make a simpler-looking but less honest
product. Source choice belongs near the decision, and provider attribution
belongs inside the result.

## Design Lessons

### A palette is a set of responsibilities, not attractive swatches

Earlier colour revisions failed because several saturated colours all behaved
like primary accents. Assigning material roles to paper, malachite, azurite,
cinnabar, ochre, and ink created coherence. When a colour has no unique job, do
not add it.

### Cultural inspiration works best as structure

Literal seals, clouds, vessels, mountains, and decorative borders quickly became
tourism imagery or disconnected icons. Handscroll pacing, negative space,
mineral-colour relationships, and quiet human scale translated much better to a
global digital product.

### Repetition weakens special imagery

Using the same mountains in the header, picker, and action made each feel less
intentional. The header now establishes place with a ridge; the decision action
suggests movement with a waterway. Prominent images need separate narrative jobs.

### Real photography earns space

The place photo is evidence and memory, not decoration. Tiny thumbnails squander
its value. A generous popup preview and immersive viewer are justified even in a
minimal interface because they serve the product truth.

### Minimal does not mean information-poor

The list felt empty when it showed only names, areas, and stars. One concise
memory line added meaning without adding dashboard furniture. The right content
can increase richness while preserving visual quiet.

### Motion should expose material, not announce itself

The custom-cursor idea was refined into local artwork reveal and place feedback.
Good motion makes the existing interface feel responsive; bad motion becomes a
second subject. Touch and reduced-motion users should lose no information.

## UX And Responsive Lessons

### Mobile states need ownership

Making every desktop panel smaller produced stacked UI, hidden controls, and
browser-chrome collisions. On a phone, the list and place detail are separate
states. One exits before the other takes attention.

### Test short viewports, not just narrow ones

Several popup and action problems appeared only when height was constrained.
Responsive QA must include width-height combinations, safe areas, internal
scrolling, and transitions settling before geometry is measured.

### Browser automation should encode intent

The strongest Playwright tests assert product hierarchy, source provenance,
state exclusivity, visibility, overflow, and interaction roles. Exact pixel
snapshots are supporting evidence, not the whole contract.

### Wait for the state users see

A mobile test once checked geometry after opacity finished but before the longer
sheet transform completed. Polling the final geometric condition fixed the flaky
test. Synchronise with observable state, not arbitrary short sleeps.

## Engineering Lessons

### A single-file app can still have architecture

`index.html` is large, but behavior is organised by concern and `render()` is a
clear boundary. Introducing a framework would add migration cost and hosting
complexity without a validated user benefit. Refactor when ownership or testing
becomes materially difficult, not because file length is unfashionable.

### Seed updates are migrations

Once users edit local data, changing `data.js` is no longer simple replacement.
Versioned merge logic and stable update keys prevent real personal maps from being
destroyed or receiving duplicate team visits.

### Free APIs still have operational contracts

Nominatim is free to call but should be used sparingly and attributed. Google
Places may improve coverage but introduces keys, billing, field tiers, and policy
requirements. Provider abstraction is more future-proof than changing the entire
map stack prematurely.

### Static sharing has a scaling ceiling

Encoding the map in a URL elegantly avoids accounts and servers. It also creates
a length limit. Keep the tradeoff explicit so future growth does not accidentally
turn a privacy feature into a reliability bug.

## Collaboration Lessons

### External reviewers are useful, not authoritative

The project attempted to use Claude Fable for independent design review. Access
depended on authentication that was not consistently available, especially where
enterprise permission might be required. The fallback is an explicit independent
review pass using the same product evidence, not pretending another reviewer ran.

Never block ordinary progress on a named reviewer tool. Never claim an external
review happened unless it actually did.

### Preserve rejected work without polluting the product

The seal explorations were neither deleted nor merged into `main`. A named archive
branch plus a rejection note keeps the learning accessible while protecting the
production asset set. Use this pattern for substantial research artifacts that
may be informative but should not ship.

### Write decisions after convergence

Exploration is messy. The permanent record should preserve the alternatives and
why they lost, but the active constitution should describe only the current rule.
This keeps future agents informed without making them relive every iteration.
