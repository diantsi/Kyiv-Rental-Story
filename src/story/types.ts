export type SceneVisual = {
  backgroundColor?: string;
  backgroundImage?: string;
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

export type DialogueBeat = {
  speaker: string;
  text: string;
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
