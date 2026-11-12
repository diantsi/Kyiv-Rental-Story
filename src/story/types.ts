export type SceneVisual = {
  backgroundColor?: string;
  backgroundImage?: string;
};

export type DialogueBeat = {
  speaker: string;
  text: string;
};

export type StoryChoice = {
  id: string;
  label: string;
  nextNodeId: string;
};

export type StoryNode = {
  id: string;
  title: string;
  location?: string;
  time?: string;
  visual?: SceneVisual;
  beats: DialogueBeat[];
  nextNodeId?: string;
  choices?: StoryChoice[];
};
