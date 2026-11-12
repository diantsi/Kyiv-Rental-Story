export type SceneVisual = {
  backgroundColor?: string;
  backgroundImage?: string;
};

export type DialogueBeat = {
  speaker: string;
  text: string;
};

export type StoryFlag =
  | "larysa_contact"
  | "contract_checked"
  | "documents_checked"
  | "lied_to_oksana"
  | "scam_recognized";

export type EndingId = `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

export type StoryEffects = {
  oliaRelationship?: number;
  maksRelationship?: number;
  budgetUAH?: number;
  stress?: number;
  flags?: Partial<Record<StoryFlag, boolean>>;
};

export type StoryTransition = {
  nextNodeId: string;
  effects?: StoryEffects;
};

export type StoryChoice = StoryTransition & {
  id: string;
  label: string;
};

export type StoryNode = {
  id: string;
  title: string;
  location?: string;
  time?: string;
  visual?: SceneVisual;
  beats: DialogueBeat[];
  nextNodeId?: string;
  effects?: StoryEffects;
  choices?: StoryChoice[];
};

export type GameState = {
  nodeId: string;
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
