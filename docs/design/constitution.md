# Roaming Scroll

TravelPins' project-specific design constitution. This document constrains this
project only. It is not a default style for future products.

## Product Truth

TravelPins is a personal map that helps people remember and choose places worth
returning to.

Primary audience: curious urban explorers who save meaningful coffee, food, and
travel places for themselves or a small circle.

Experience qualities:

- Personal, not encyclopedic.
- Quiet, not empty.
- Cultivated, not ornamental.
- Decisive, not algorithmic.

## Design Thesis

Combine the utility of a map with the warmth and pacing of an annotated travel
journal. Draw from the rhythm, negative space, mineral color relationships, and
small human scale of a landscape handscroll. Do not reproduce historical motifs
as decoration.

## Principles

1. Let places, photographs, and memories carry the experience.
2. Give each screen one dominant action and one visual emphasis.
3. Use space to establish hierarchy before adding containers or decoration.
4. Keep the map functional; let editorial warmth live in the surrounding UI.
5. Treat mobile list and place-detail states as mutually exclusive.
6. Invite rather than instruct. Remove copy the interface already explains.
7. Prefer a typographic wordmark to a forced cultural symbol.

## Visual Roles

The CSS custom properties in `index.html` are the canonical implementation.

| Role | Token | Responsibility |
| --- | --- | --- |
| Paper | `--paper`, `--surface` | Reading surfaces and warm negative space |
| Malachite | `--accent` | Primary actions and confirmation |
| Azurite | `--azurite` | Direction, navigation, and wayfinding |
| Cinnabar | `--place` | Places, pins, and rare focal marks |
| Ochre | `--rating` | Ratings and restrained historical warmth |
| Ink | `--ink`, `--ink-soft` | Content hierarchy |

Do not use two saturated roles as simultaneous primary actions. Cinnabar is not
a generic button color. Decorative imagery must remain quieter than content.

## Typography

- Newsreader: product name, place names, modal titles, and reflective memory copy.
- Source Sans 3: controls, metadata, labels, and supporting copy.
- Do not scale type with viewport width.
- Keep compact controls compact; reserve large serif type for genuine titles.
- Letter spacing is neutral except for short uppercase eyebrows.

## Shape and Depth

- Use 4-8px radii for controls and content surfaces.
- Use cards only for repeated places, modals, and framed tools.
- Prefer fine rules and paper-tone changes to nested cards.
- Shadows establish map elevation, not decoration. Use the lightest shadow that
  separates a surface from the map.
- Interactive targets are at least 40px and preferably 44px on touch screens.

## Imagery

- Header imagery establishes the long-scroll rhythm.
- The decision control uses the waterway image, not another mountain ridge.
- Preserve a clear text-safe area in every image.
- Real place photography is generous, inspectable, and never merely atmospheric.
- Use cultural sources for proportion, rhythm, color, and material behavior; do
  not assemble obvious symbols into a generic "Chinese style" collage.

## Responsive Behavior

- Desktop: map, sidebar, and place popup may coexist without overlap.
- Mobile list state: the bottom sheet owns the lower portion of the viewport.
- Mobile detail state: the list exits completely; the popup owns attention.
- Long popup content scrolls internally. Map controls yield while details are open.
- Respect dynamic viewport height and safe-area insets.
- Verify regular phone, short phone, narrow desktop, and short desktop states.

## Motion

- Motion reveals meaning already present; it does not add decorative spectacle.
- Use one quiet grammar: journeys reveal, places echo, and selections settle.
- Fine-pointer hover may locally reveal existing artwork. Never replace the
  system cursor or attach particles, trails, or click ripples.
- Cinnabar hover feedback belongs only to places and map pins.
- Keep spatial movement within 3px and interaction transitions near 180-320ms.
- Touch, coarse pointers, and `prefers-reduced-motion` receive a still interface.
- Motion must not reflow content or change an interactive target's dimensions.

## Core Copy Flows

The picker begins with one question and then separates trusted memory from
external discovery. Do not blend their provenance.

1. `Where to next?`
2. `From my map` or `Somewhere new`

From the personal map:

- `What sounds good?`
- `Only places worth returning to.`
- `Stay awhile` - `Room to settle in.`
- `Choose for me`
- `Try this one`

From nearby discovery:

- `A place not on your map yet.`
- `Find a place`
- `Try somewhere new`
- `Open directions`

Do not repeat the same instruction as a heading, description, and button.
External place data must name its source inside the result container. Google
Places content uses compliant `Google Maps` attribution and remains transient.

## Do Not

- Do not add fake seals, stock cloud motifs, literal bridges, or souvenir-style
  historical symbols to make the product look more cultural.
- Do not reuse the same landscape image in multiple prominent surfaces.
- Do not introduce a new accent color without assigning it a unique role.
- Do not place explanatory copy beneath a self-explanatory command.
- Do not let desktop panels stack visibly behind mobile details.
- Do not trade readability or interaction clarity for atmosphere.

## Change Rule

A new pattern belongs in this constitution only after it appears in at least three
real uses or resolves a repeated product problem. Record deliberate exceptions in
`decisions.md`. Update reference screenshots after accepted visual changes.
