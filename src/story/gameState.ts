import type {
  EndingId,
  GameState,
  StoryEffects,
  StoryFlag,
  StoryNode,
  StoryTransition,
} from "./types";
import {
  initialNodeId,
  storyNodes,
} from "./story";

export const SAVE_VERSION = 1;

const initialFlags: Record<StoryFlag, boolean> = {
  larysa_contact: false,
  contract_checked: false,
  documents_checked: false,
  lied_to_oksana: false,
  scam_recognized: false,
};

export function createInitialGameState(): GameState {
  return {
    nodeId: initialNodeId,
    beatIndex: 0,
    oliaRelationship: 50,
    maksRelationship: 50,
    budgetUAH: 20_000,
    stress: 10,
    flags: { ...initialFlags },
    choices: [],
    saveVersion: SAVE_VERSION,
  };
}

export const initialGameState = createInitialGameState();

export type GameAction =
  | { type: "advance" }
  | { type: "choose"; choiceId: string };

function clampScore(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function applyEffects(
  state: GameState,
  effects: StoryEffects = {},
): GameState {
  return {
    ...state,
    oliaRelationship: clampScore(
      state.oliaRelationship + (effects.oliaRelationship ?? 0),
    ),
    maksRelationship: clampScore(
      state.maksRelationship + (effects.maksRelationship ?? 0),
    ),
    budgetUAH: Math.max(0, state.budgetUAH + (effects.budgetUAH ?? 0)),
    stress: clampScore(state.stress + (effects.stress ?? 0)),
    flags: {
      ...state.flags,
      ...effects.flags,
    },
  };
}

export function getThresholdEnding(
  state: Pick<
    GameState,
    "oliaRelationship" | "maksRelationship" | "stress"
  >,
): EndingId | undefined {
  if (
    state.stress >= 60 ||
    (state.oliaRelationship <= 30 && state.maksRelationship <= 30)
  ) {
    return "F8";
  }

  if (state.oliaRelationship <= 30) {
    return "F6";
  }

  if (state.maksRelationship <= 30) {
    return "F7";
  }

  return undefined;
}

function isEndingId(nodeId: string): nodeId is EndingId {
  return /^F[1-9]$/.test(nodeId);
}

export function getVisibleBeats(node: StoryNode, state: GameState) {
  return node.beats.filter((beat) => {
    if (!beat.condition) {
      return true;
    }

    const expectedValue = beat.condition.equals ?? true;
    return state.flags[beat.condition.flag] === expectedValue;
  });
}

export function resolveTransition(
  state: GameState,
  transition: StoryTransition,
  choiceId?: string,
): GameState {
  const choices = choiceId ? [...state.choices, choiceId] : state.choices;

  if (
    transition.minimumBudgetUAH !== undefined &&
    state.budgetUAH < transition.minimumBudgetUAH &&
    transition.insufficientBudgetEndingId
  ) {
    return {
      ...state,
      nodeId: transition.insufficientBudgetEndingId,
      beatIndex: 0,
      choices,
      endingId: transition.insufficientBudgetEndingId,
    };
  }

  const resolvedState = applyEffects(state, transition.effects);

  if (isEndingId(transition.nextNodeId)) {
    return {
      ...resolvedState,
      nodeId: transition.nextNodeId,
      choices,
      beatIndex: 0,
      endingId: transition.nextNodeId,
    };
  }

  const thresholdEnding = getThresholdEnding(resolvedState);

  if (thresholdEnding) {
    return {
      ...resolvedState,
      nodeId: thresholdEnding,
      choices,
      beatIndex: 0,
      endingId: thresholdEnding,
    };
  }

  return {
    ...resolvedState,
    nodeId: transition.nextNodeId,
    beatIndex: 0,
    choices,
    endingId: undefined,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const scene = storyNodes[state.nodeId];

  if (!scene) {
    return state;
  }

  if (action.type === "advance") {
    const beats = getVisibleBeats(scene, state);
    const isLastBeat = state.beatIndex === beats.length - 1;

    if (!isLastBeat) {
      return { ...state, beatIndex: state.beatIndex + 1 };
    }

    if (scene.kind === "ending" || !scene.nextNodeId) {
      return state;
    }

    return resolveTransition(state, {
      nextNodeId: scene.nextNodeId,
      effects: scene.effects,
      minimumBudgetUAH: scene.minimumBudgetUAH,
      insufficientBudgetEndingId: scene.insufficientBudgetEndingId,
    });
  }

  if (scene.kind === "ending") {
    return state;
  }

  const choice = scene.choices?.find(
    (candidate) => candidate.id === action.choiceId,
  );

  if (!choice || state.choices.includes(choice.id)) {
    return state;
  }

  return resolveTransition(state, choice, choice.id);
}
