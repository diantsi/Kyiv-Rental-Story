# Kyiv Rental: MVP Technology Stack

## Objective

Build a complete, playable version of *Kyiv Rental* for desktop and mobile browsers within one week.

The MVP implements the complete canonical content from `Script.md`: 13 scene nodes, 27 interactive options, all linear and automatic transitions, and 9 endings (`F1–F9`). A single playthrough may skip scenes or end early because the story is branched.

## Selected stack

### Language boundary

- Keep repository instructions, technical documentation, filenames, and code identifiers in English.
- Render all player-facing story and interface copy in Ukrainian, using `Script.md` as the canonical text source.
- Do not translate dialogue, scene titles, choice labels, or visible UI labels into English. Technical IDs such as `04L`, `F8`, and `larysa_contact` remain unchanged.

### Interface and build tooling

- **React** — visual-novel screens and UI components.
- **TypeScript** — contracts for nodes, dialogue, effects, flags, transitions, saves, and endings.
- **Vite** — local development and production builds.
- **HTML and CSS** — dialogue, calls, chats, listings, documents, checklists, and ending screens.

### Scenario format

- Store the scenario as typed TypeScript data, using stable IDs from `Script.md` such as `04L`, `10S`, and `F8`.
- Keep narrative data separate from React components.
- Each node may contain dialogue beats, media references, actions or choices, effects, prerequisites, and a transition.
- Support direct ending transitions, automatic budget gates, and the global relationship/stress control check.
- **Ink is not used for the MVP.** The current graph is small enough to remain clear as typed data without an additional scripting language or parser.

### Game state

- **React `useReducer`** is the single source of truth for the current run.
- React Context may expose state and dispatch to nested screens when needed.
- Relationship and stress values may be clamped to `0–100`.
- Budget is stored as an integer amount in UAH, starts at `20_000`, and must never be treated as a normalized `0–100` score.
- Budget must not become negative.
- **Zustand is not used for the MVP.**

Minimal state shape:

```ts
type StoryFlag =
  | "larysa_contact"
  | "contract_checked"
  | "documents_checked"
  | "lied_to_oksana"
  | "scam_recognized";

type GameState = {
  nodeId: string;
  beatIndex: number;
  oliaRelationship: number; // starts at 50
  maksRelationship: number; // starts at 50
  budgetUAH: number;        // starts at 20_000
  stress: number;           // starts at 10, reaches crisis at 60
  flags: Record<StoryFlag, boolean>;
  choices: string[];
  endingId?: `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
  saveVersion: number;
};
```

### Transition rules

Choice resolution must be deterministic and atomic:

1. Apply the selected option’s parameter, budget, and flag effects exactly once.
2. If the option points directly to `F1–F5` or `F9`, use that direct transition.
3. After any state-changing non-final action or choice, run the control check in this order:
   - `F8` if stress is at least `60`, or if both relationship values are `30` or below;
   - otherwise `F6` if Olia’s relationship value is `30` or below;
   - otherwise `F7` if Maks’s relationship value is `30` or below;
   - otherwise proceed to the specified next scene.
4. In `11N`, route to `F9` if the budget is below `19_500`; otherwise proceed to `12N` and reduce stress by `5`.
5. Persist the fully resolved state so that reloading cannot apply an effect twice.

Keep the threshold check in one pure function. Keep direct transitions in the scenario data rather than reproducing them as React conditionals.

### Saving

- Use **`localStorage`** for versioned autosave after every resolved action or choice.
- The main menu provides the Ukrainian controls “Продовжити” and “Почати спочатку.”
- “Почати спочатку” clears only this game’s save key.
- Invalid or incompatible save data falls back safely to a new game.
- Saves remain local to one browser and are not synchronized across devices.

### Audio

- **Howler.js** handles background music and sound effects.
- For the MVP, 1–2 music themes and 4–6 high-value effects are sufficient; the full asset list remains a production target rather than a release blocker.
- Start audio only after a user interaction to comply with browser autoplay restrictions.
- Provide a persistent sound on/off control.
- Direct **Web Audio API** usage is out of scope.

### Animation

- Use **CSS transitions and keyframes** for character entrances, emotion changes, message sequences, the emergency-light effect, checklist confirmation, and ending transitions.
- Animations must not delay reading or block input.
- Respect `prefers-reduced-motion`.
- Motion is out of scope for the MVP.

### Testing and validation

- Comprehensive automated testing is not required for the MVP.
- **Playwright is not used** in the first release.
- Manually verify representative routes on desktop and mobile.
- If time permits, use **Vitest** only for pure game logic:
  - one-time application of effects;
  - `F8 → F6 → F7` threshold priority;
  - the `19_500` UAH budget gate;
  - reachability fixtures for `F1–F9`;
  - save restoration without duplicated effects.

### PWA

- Add PWA support only after the complete browser playthrough is stable.
- The minimum implementation includes a manifest, icons, a service worker, and versioned caching of required static files.
- The novel should reopen offline after one successful online load.
- PWA work must not block the browser release if the one-week schedule becomes tight.

### Hosting

- Deploy the production build on **Vercel Hobby**.
- Connect a GitHub repository for automatic deployments from the main branch.
- Expected build settings:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

- Vercel provides the HTTPS required for PWA installation.
- The MVP requires no server, database, authentication, or paid cloud service.

## Features included in the MVP

- all canonical content from `Script.md`;
- 13 scene nodes, 27 interactive options, and endings `F1–F9`;
- separate relationships with Olia and Maks;
- UAH budget, stress, and the five canonical story flags;
- direct, automatic, and threshold-based transitions;
- contextual feedback after choices and visible actual expenditure;
- autosave, continue, and start over;
- dialogue, phone call, Viber chat, listing, checklist, contract, and handover-report views;
- ending screen with the obtained ending and key decisions;
- sound control, keyboard focus, and responsive mobile layout;
- production build and Vercel deployment.

## Excluded from the first release

- Ink;
- Zustand;
- Motion;
- direct Web Audio API;
- Playwright;
- full voice acting;
- dialogue history;
- unlocked-ending gallery;
- adjustable text speed;
- restarting an individual scene;
- cross-device save synchronization;
- backend, database, and authentication;
- complex video sequences and unique animation for every choice.

## Final stack

**React + TypeScript + Vite + typed branching scenario data + `useReducer` + versioned `localStorage` + Howler.js + CSS animations + optional Vitest + optional minimal PWA + Vercel.**
