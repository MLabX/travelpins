# Design Decisions

## 2026-07: Personal Atlas to Roaming Scroll

The product moved away from an authenticated-personality concept toward a generic
personal map. Reputation may inform source data, but no person's name defines the
brand or interface.

## 2026-07: No Standalone Seal

Several generated seals and literal cultural motifs felt like app icons or tourism
merchandise. TravelPins now uses a typographic wordmark. The landscape band carries
the visual identity; cinnabar remains reserved for places.

## 2026-07: Essence, Not Motifs

The visual system draws from handscroll pacing, negative space, mineral colors,
and human-scale details. It does not require mountains, bridges, vessels, clouds,
or other literal historical objects in every surface.

## 2026-07: Distinct Header and Decision Imagery

The header uses a distant ridge. The decision control uses a waterway so the two
prominent surfaces do not repeat the same visual idea.

## 2026-07: Memory-First Index

The main list leads with recent visits and short reasons to return. Ratings remain
available in place details but do not dominate the personal index.

## 2026-07: Mobile States Are Exclusive

When a place detail opens on mobile, the main list exits the viewport and map
controls yield. This prevents stacked sheets from competing for attention.

## 2026-07: Picker Copy Is a Conversation

The flow is `Where to next?` -> `What sounds good?` -> `Choose for me` ->
`Try this one`. Repeated explanatory copy was removed.

## 2026-07: Memory and Discovery Stay Distinct

The picker has two explicit sources: trusted places already in the personal map,
and transient nearby candidates. Recommendation quality is a system promise, not
a toggle. External discovery names its provider, asks for location only on an
explicit action, and returns one possibility rather than a search-results list.
OpenStreetMap Nominatim keeps the feature usable without a key; candidates are
cached for the open picker session so repeated choices do not repeat public API
requests. A restricted Google Places key can replace the provider without changing
the product flow.

## 2026-07: Decide Before Retrieve

The sidebar presents `Where to next?` before search. The decision action is the
product's distinctive entry; search remains a quieter utility placed directly
beside category filters, sorting, and the list it controls. This creates one
continuous retrieval region and prevents the decision card from interrupting
search and results.

## 2026-07: Motion as Material Response

TravelPins keeps the system cursor and avoids ambient animation. On fine pointers,
the decision control locally reveals more of its existing waterway, while place
rows and map pins answer with a restrained cinnabar ring. Selection uses the same
place color in a short settling stroke. These responses clarify journey, place,
and selection without introducing a second decorative language. Touch and reduced
motion modes remain still.
