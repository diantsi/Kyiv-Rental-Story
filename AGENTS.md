# AGENTS.md — Kyiv Rental

## Repository orientation

Read only the source needed for the current task:

- `Script.md` — canonical narrative, node IDs, choices, effects, flags, transitions, and endings.
- `technical_stack.md` — approved architecture, MVP boundaries, state model, validation, and Vercel deployment.
- `assets.md` — canonical media inventory, reuse plan, UI assets, and file formats.

Inspect the live repository before changing it. Do not assume that the application scaffold, dependencies, scripts, or assets already exist.

## Critical invariants

- Do not shorten the story: implement all 13 scene nodes, 27 interactive options, and endings `F1–F9`. A single playthrough may skip nodes or end early.
- English is the canonical documentation and story-source language.
- Keep story data separate from React components and use the stable node and ending IDs from `Script.md`.
- Track separate relationship values for Olia and Maks, both starting at `50`.
- Track budget as UAH, starting at `20_000`; do not normalize it to `0–100` or allow it to become negative.
- Stress starts at `10`; the crisis threshold is `60`.
- Preserve these exact flags: `larysa_contact`, `contract_checked`, `documents_checked`, `lied_to_oksana`, `scam_recognized`.
- Apply every effect exactly once and persist only the fully resolved, versioned state to `localStorage`.
- After a non-final state-changing action, resolve thresholds in this order: `F8` when stress ≥ 60 or both relationships ≤ 30; otherwise `F6` when Olia ≤ 30; otherwise `F7` when Maks ≤ 30; otherwise continue to the declared next node.
- Keep direct transitions to `F1–F5` and `F9` in scenario data. Preserve the `19_500` UAH budget gate in `11N`.
- Do not add technologies listed as out of scope in `technical_stack.md` without an explicit user decision.
- Use fictional addresses, document numbers, identity details, and payment credentials.

## Working rules

- Make the smallest coherent change that completes the requested task.
- Preserve unrelated and user-authored worktree changes.
- Prefer straightforward code for this novel over a general-purpose visual-novel engine.
- Render chats, listings, contracts, amounts, and buttons in accessible HTML/CSS rather than raster images.
- Do not embed large base64 assets in story data or runtime code.
- Do not add a backend, database, authentication, or cross-device saves unless the scope changes.
- Do not commit, push, connect accounts, or deploy to Vercel without an explicit request.

## Verification

Match verification to the change:

- run configured lint/typecheck commands and `npm run build` for code changes, when available;
- run only existing relevant tests; do not add Playwright;
- check UI changes at mobile and desktop widths;
- for story logic, verify one-time effects, save restoration, threshold priority, the `19_500` budget gate, and the affected ending route;
- never claim that a check passed unless it was actually run.

In the handoff, briefly report changed files, verification performed, unverified work, and remaining assumptions or blockers.
