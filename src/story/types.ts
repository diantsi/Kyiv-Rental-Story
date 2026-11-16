export type ChatReply = {
  /** What Marta writes in the chat. */
  text: string;
  /** Short answer from the other side, shown right after. */
  answer?: string;
};

export type ChatBubble = {
  text: string;
  /** Marta's own message (right side). */
  mine?: boolean;
  /** Appears a moment later, like a typed answer. */
  delayed?: boolean;
};

export type SceneVisual = {
  backgroundColor?: string;
  backgroundImage?: string;
  /** Optional looping-free visual effect played when the scene context appears. */
  effect?: "lamp-flicker";
  /** Alternative background for the context sheet (key from beatBackdrops). */
  contextBackdrop?: "arrival";
  /** Scene has an in-world listing page: laptop intro + "view listing" button. */
  listing?: boolean;
  /** Lines by this speaker appear as chat bubbles on a phone instead of in the dialogue box. */
  chat?: {
    speaker: string;
    /**
     * Optional replies Marta can type after the beat with the given index (the next beat must fit every option).
     * They are cosmetic: no effects, and every option leads to the same next beat.
     */
    replies?: Record<number, ChatReply[]>;
  };
  /** Incoming phone call shown before the given beat; the player accepts or declines. */
  /** "Call ended" screen shown before the given beat (e.g. right after Marta hangs up). */
  callEnded?: { beforeBeat: number; requiresFlag?: StoryFlag };
  call?: { beforeBeat: number; requiresFlag?: StoryFlag; autoHangUp?: boolean; autoAnswer?: boolean; caller?: "larysa" | "unknown" };
};

export type StoryFlag =
  | "larysa_contact"
  | "contract_checked"
  | "documents_checked"
  | "lied_to_oksana"
  | "scam_recognized";

export type EndingId = `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

export type SceneId =
  | "01"
  | "02"
  | "03"
  | "04L"
  | "05L"
  | "06I"
  | "07I"
  | "08O"
  | "09O"
  | "10S"
  | "11N"
  | "12N"
  | "13N";

export type StoryNodeId = SceneId | EndingId;

export type SpriteMood =
  | "angry"
  | "annoyed"
  | "confused"
  | "happy"
  | "sad"
  | "sheepish"
  | "showing"
  | "shocked"
  | "skeptical"
  | "thinking";

export type DialogueBeat = {
  speaker: string;
  text: string;
  /** Optional alternative background for this beat (key from beatBackdrops). */
  backdrop?: "arrival";
  /** Optional sprite expression for the speaker; defaults to neutral. */
  mood?: SpriteMood;
  condition?: {
    flag: StoryFlag;
    equals?: boolean;
  };
};

export type StoryEffects = {
  oliaRelationship?: number;
  maksRelationship?: number;
  budgetUAH?: number;
  stress?: number;
  flags?: Partial<Record<StoryFlag, boolean>>;
};

export type StoryTransition = {
  nextNodeId: StoryNodeId;
  effects?: StoryEffects;
  minimumBudgetUAH?: number;
  insufficientBudgetEndingId?: EndingId;
};

export type StoryChoice = StoryTransition & {
  id: string;
  label: string;
};

export type StoryNode = {
  id: StoryNodeId;
  kind: "scene" | "ending";
  title: string;
  location?: string;
  time?: string;
  description: string;
  consequence: string;
  visual?: SceneVisual;
  beats: DialogueBeat[];
  nextNodeId?: StoryNodeId;
  effects?: StoryEffects;
  minimumBudgetUAH?: number;
  insufficientBudgetEndingId?: EndingId;
  choices?: StoryChoice[];
};

export type GameState = {
  nodeId: StoryNodeId;
  /** True while the scene context sheet is shown before the dialogue beats. */
  showingContext: boolean;
  beatIndex: number;
  oliaRelationship: number;
  maksRelationship: number;
  budgetUAH: number;
  stress: number;
  flags: Record<StoryFlag, boolean>;
  choices: string[];
  endingId?: EndingId;
  saveVersion: number;
};
