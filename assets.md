# Kyiv Rental: MVP Asset List

This list is aligned with the canonical branching story in `Script.md`: 13 scene nodes and 9 endings (`F1–F9`). Reuse backgrounds and UI compositions aggressively; the full narrative must not be reduced to save asset-production time.

All player-facing text must be Ukrainian and rendered as accessible HTML/CSS. Asset-production instructions remain in English; do not bake Ukrainian dialogue, labels, amounts, or document text into raster images.

## Overall scope

- 11 reusable backgrounds;
- 18 character assets;
- 14 supplementary images or document compositions;
- 9 ending compositions built largely from reusable assets;
- 12 UI components;
- 3 music themes;
- 12 sound effects;
- 6 simple animation groups.

## 1. Backgrounds — 11

- [ ] Cover/main menu featuring Kyiv, Marta, Olia, and Maks.
- [ ] Dormitory room and corridor base, with an emergency-light variant.
- [ ] Dormitory kitchen.
- [ ] Damaged high-rise exterior in Lukianivka.
- [ ] Larysa’s apartment in the damaged building.
- [ ] University corridor.
- [ ] Apartment near Vasylkivska.
- [ ] Oksana’s apartment in Syrets.
- [ ] University reading room.
- [ ] Final apartment in Obolon.
- [ ] Crowded replacement dormitory for `F9`.

### Background reuse

- Scene `03` uses the listing UI over the dormitory or a neutral screen background.
- Scene `04L` uses a split-screen phone-call layout rather than a dedicated location illustration.
- Scene `09O` shows the taxi as a short insert, then reuses Oksana’s apartment.
- Scenes `10S` and `11N` rely primarily on phone UI over the dormitory kitchen and reading room.
- Scene `13N` uses a tighter kitchen-table crop of the Obolon apartment.
- `F1`, `F2`, `F4`, and `F5` reuse their corresponding apartment backgrounds with changed props and lighting.
- `F6` and `F7` reuse the dormitory corridor base; `F8` reuses the dormitory kitchen.

## 2. Characters — 18 assets

Export character sprites as transparent PNG or WebP files with consistent scale and stable head placement.

### Marta — 4

- [ ] Neutral.
- [ ] Focused/organizing.
- [ ] Worried.
- [ ] Irritated/determined.

### Olia — 4

- [ ] Neutral.
- [ ] Relieved/pleased.
- [ ] Skeptical.
- [ ] Hurt/angry.

### Maks — 4

- [ ] Neutral.
- [ ] Joking.
- [ ] Worried about money.
- [ ] Arguing/frustrated.

### Supporting characters — one each

- [ ] Larysa — energetic professional smile.
- [ ] Ihnat — overly familiar, holding a contract or phone.
- [ ] Oksana — initially welcoming but guarded.
- [ ] Andrii — calm and straightforward.
- [ ] Dormitory supervisor — tired, holding the relocation notice.
- [ ] “The Viber Owner” — chat avatar rather than a full sprite.

Use subtle dimming, scaling, framing, and text to convey changes in supporting-character mood rather than producing extra expressions.

## 3. Supplementary images and documents — 14

- [ ] Dormitory relocation notice.
- [ ] The three criteria sheets plus the UAH 20,000 starting-budget summary.
- [ ] Larysa’s suspicious UAH 10,000 listing card.
- [ ] Collage of inconsistent apartment photos.
- [ ] Ihnat’s listing card and video-preview frame.
- [ ] Ihnat’s malformed contract with conflicting deposit amounts.
- [ ] Oksana’s no-commission listing card.
- [ ] Taxi-cost/banking-app insert showing UAH 2,000 spent.
- [ ] Fraudulent Podil listing photo collage.
- [ ] Fake passport and card-recipient details from the Viber scam.
- [ ] Andrii’s floor plan and draft-contract preview.
- [ ] Property-register extract and utility-bill composition.
- [ ] Final apartment inspection checklist: ownership, water, windows, meters, internet, shelter, and defects.
- [ ] Final contract and handover report with meter readings, defects, and deposit-return terms.

Create all listing text, messages, timers, amounts, contract clauses, and bank details in HTML/CSS. Do not bake readable text into raster images. Every address, document number, identity detail, and payment credential must be fictional.

## 4. Ending compositions — 9

- [ ] `F1` “Larysa’s Gem” — boxes, failed elevator, recurring leak, and Olia working in the passage room.
- [ ] `F2` “The Contract That Wrote Itself” — move-out scene with the unexpected UAH 5,000 cleaning invoice.
- [ ] `F3` “A Deposit into Nowhere” — vanished Viber chat and successful bank transfer.
- [ ] `F4` “Ordinary, but Yours” — pizza and buckwheat among boxes in the Obolon apartment.
- [ ] `F5` “Keys Before the Checklist” — the friends discover the undocumented washing-machine crack.
- [ ] `F6` “Olia Searches Alone” — Olia closes the laptop and leaves the shared chat.
- [ ] `F7` “Maks Budgets for One” — Maks shows a room listing on the dormitory stairs.
- [ ] `F8` “Three Separate Ways” — three phones ringing during the argument in the dormitory kitchen.
- [ ] `F9` “Back to the Dormitory” — the friends enter the crowded replacement room.

These are compositions, not necessarily nine unique full illustrations. Reuse backgrounds, sprites, props, phone UI, lighting, and color grading.

## 5. UI components — 12

Create UI as accessible HTML/CSS components rather than finished raster images.

- [ ] Main menu with “Продовжити,” “Почати гру,” and “Звук” controls.
- [ ] Dialogue box.
- [ ] Speaker nameplate.
- [ ] Choice button with hover, focus, pressed, and disabled states.
- [ ] Contextual consequence notification for Olia, Maks, stress, and safe actions.
- [ ] Split-screen phone-call interface.
- [ ] Messenger/Viber interface with voice messages and countdown pressure.
- [ ] Property-listing card.
- [ ] Current-budget and expense display in UAH.
- [ ] Interactive inspection checklist.
- [ ] Contract and handover-report viewer.
- [ ] Ending screen with ending ID/title and key decisions.

### Excluded from the MVP

- dialogue history;
- unlocked-ending gallery;
- adjustable text speed;
- restarting an individual scene;
- complex settings menu.

## 6. Music — 3 themes

- [ ] Calm urban/dormitory theme.
- [ ] Tense theme for pressure, conflict, unsafe terms, and fraud.
- [ ] Warm resolution theme with a quieter or bittersweet variation for negative endings.

## 7. Sound effects — 12

- [ ] Message notification.
- [ ] Phone ring and vibration set.
- [ ] Button/UI click.
- [ ] Short comedic accent.
- [ ] Power outage and emergency-light hum.
- [ ] Paper notice/tape sound.
- [ ] Elevator creak or failure sound.
- [ ] Dripping water.
- [ ] Heartbeat or countdown timer.
- [ ] Taxi/traffic ambience.
- [ ] Page turn, pen, and document handling.
- [ ] Key turning in a lock.

## 8. Animation groups — 6

- [ ] Character entrance and emotion transition.
- [ ] Dialogue text appearance.
- [ ] Chat and voice-message appearance.
- [ ] Power-outage/emergency-light transition.
- [ ] Inspection-hotspot confirmation.
- [ ] Ending transition and optional final-stat bar fill.

All animation must respect `prefers-reduced-motion` and must not delay reading or input.

## 9. Assets not produced for the MVP

- A separate background for every node or branch.
- Additional expressions for every supporting character.
- Photorealistic legal documents, passports, or banking screens.
- Separate portrait and landscape versions of every background.
- Complex video sequences.
- Full voice acting.
- Unique animation for every choice.
- Nine entirely unique ending environments when an existing background can be reused.
- Dozens of custom icons; use one consistent SVG icon library.
- Buttons or essential text rendered as images.

## 10. Recommended formats

- Backgrounds: WebP, 2560×1440 or 1920×1080, with no embedded text.
- Characters: transparent PNG/WebP, approximately 1024×1536.
- Supplementary illustrations: WebP or PNG.
- Icons: SVG.
- Music: OGG and MP3.
- Sound effects: OGG and MP3, or WAV during production.
- Optional short overlays: optimized WebM or CSS animation.

Add all chats, buttons, listings, amounts, and contract text through code. This keeps the source editable, responsive, accessible, and consistent across desktop and mobile layouts.
