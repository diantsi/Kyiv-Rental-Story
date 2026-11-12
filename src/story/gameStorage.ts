import { getVisibleBeats, SAVE_VERSION } from "./gameState";
import { storyNodes } from "./story";
import type {
  EndingId,
  GameState,
  StoryFlag,
  StoryNodeId,
} from "./types";

export const GAME_SAVE_KEY = "kyiv-rental:save";

const storyFlags: StoryFlag[] = [
  "larysa_contact",
  "contract_checked",
  "documents_checked",
  "lied_to_oksana",
  "scam_recognized",
];

const endingIds = new Set<EndingId>([
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
]);

const choiceIds = new Set(
  Object.values(storyNodes).flatMap(
    (node) => node.choices?.map((choice) => choice.id) ?? [],
  ),
);

type GameStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIntegerInRange(value: unknown, minimum: number, maximum: number) {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function isValidFlags(value: unknown): value is GameState["flags"] {
  return (
    isRecord(value) &&
    Object.keys(value).length === storyFlags.length &&
    storyFlags.every((flag) => typeof value[flag] === "boolean")
  );
}

function isValidChoices(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (choiceId) => typeof choiceId === "string" && choiceIds.has(choiceId),
    ) &&
    new Set(value).size === value.length
  );
}

export function parseGameState(value: unknown): GameState | null {
  if (!isRecord(value) || value.saveVersion !== SAVE_VERSION) {
    return null;
  }

  if (typeof value.nodeId !== "string") {
    return null;
  }

  const scene = storyNodes[value.nodeId as StoryNodeId];

  if (
    !scene ||
    !isIntegerInRange(value.oliaRelationship, 0, 100) ||
    !isIntegerInRange(value.maksRelationship, 0, 100) ||
    !isIntegerInRange(value.budgetUAH, 0, Number.MAX_SAFE_INTEGER) ||
    !isIntegerInRange(value.stress, 0, 100) ||
    !isValidFlags(value.flags) ||
    !isValidChoices(value.choices)
  ) {
    return null;
  }

  if (
    value.endingId !== undefined &&
    (typeof value.endingId !== "string" ||
      !endingIds.has(value.endingId as EndingId))
  ) {
    return null;
  }

  if (
    (scene.kind === "ending" && value.endingId !== scene.id) ||
    (scene.kind === "scene" && value.endingId !== undefined)
  ) {
    return null;
  }

  const state: GameState = {
    nodeId: value.nodeId as StoryNodeId,
    beatIndex: value.beatIndex as number,
    oliaRelationship: value.oliaRelationship as number,
    maksRelationship: value.maksRelationship as number,
    budgetUAH: value.budgetUAH as number,
    stress: value.stress as number,
    flags: value.flags,
    choices: value.choices,
    saveVersion: SAVE_VERSION,
  };

  if (value.endingId !== undefined) {
    state.endingId = value.endingId as EndingId;
  }

  const visibleBeats = getVisibleBeats(scene, state);

  if (!isIntegerInRange(state.beatIndex, 0, visibleBeats.length - 1)) {
    return null;
  }

  return state;
}

function getStorage(storage?: GameStorage): GameStorage | null {
  try {
    return storage ?? window.localStorage;
  } catch {
    return null;
  }
}

export function loadGameState(storage?: GameStorage): GameState | null {
  const availableStorage = getStorage(storage);

  if (!availableStorage) {
    return null;
  }

  try {
    const serializedState = availableStorage.getItem(GAME_SAVE_KEY);

    if (!serializedState) {
      return null;
    }

    const state = parseGameState(JSON.parse(serializedState));

    if (!state) {
      availableStorage.removeItem(GAME_SAVE_KEY);
    }

    return state;
  } catch {
    try {
      availableStorage.removeItem(GAME_SAVE_KEY);
    } catch {
      // Browser storage can be unavailable; a new in-memory run still works.
    }

    return null;
  }
}

export function saveGameState(
  state: GameState,
  storage?: GameStorage,
) {
  const availableStorage = getStorage(storage);

  if (!availableStorage) {
    return;
  }

  try {
    availableStorage.setItem(GAME_SAVE_KEY, JSON.stringify(state));
  } catch {
    // Browser storage can be unavailable; gameplay should remain usable.
  }
}

export function clearGameState(storage?: GameStorage) {
  const availableStorage = getStorage(storage);

  if (!availableStorage) {
    return;
  }

  try {
    availableStorage.removeItem(GAME_SAVE_KEY);
  } catch {
    // Browser storage can be unavailable; gameplay should remain usable.
  }
}
