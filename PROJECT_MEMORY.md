# TravelPins Project Memory

This branch is a durable handoff for humans and coding agents. It distils the
useful decisions from the project's discussions, experiments, screenshots,
commits, and browser tests. It intentionally does not preserve a raw chat
transcript: repeated suggestions, private links, credentials, and superseded
instructions would make a worse source of truth.

## Start Here

1. [Origin and evolution](docs/project-memory/origin-and-evolution.md)
2. [Architecture and data model](docs/project-memory/architecture-and-data.md)
3. [Lessons learned](docs/project-memory/lessons-learned.md)
4. [Working workflows](docs/project-memory/workflows.md)
5. [Current handoff](docs/project-memory/current-handoff.md)
6. [Machine-readable manifest](docs/project-memory/manifest.json)

The current design system remains in:

- [Roaming Scroll constitution](docs/design/constitution.md)
- [Design decisions](docs/design/decisions.md)
- [Voice and copy](docs/design/voice-and-copy.md)
- [Reference screenshots](docs/design/reference/)

## Fast Bootstrap On Another Computer

```bash
git clone --branch codex/project-memory https://github.com/MLabX/travelpins.git
cd travelpins
npm ci
npm run test:browser
```

This checks out the context-rich branch directly. Before shipping product work,
compare it with `origin/main` and intentionally decide whether the memory changes
should be merged with the product change.

## Memory Maintenance Rule

Update project memory when a decision changes the product thesis, data contract,
design language, deployment model, or repeated workflow. Routine CSS values and
small bug fixes belong in code and tests, not in the history narrative.

When updating this package:

1. Add evidence: commit, screenshot, test, or observed failure.
2. Mark superseded ideas as superseded; do not silently rewrite history.
3. Keep private source documents and API credentials out of Git.
4. Update `manifest.json` and `current-handoff.md`.
5. Run link, JSON, and Playwright verification before pushing.
