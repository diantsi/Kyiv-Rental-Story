import type { StoryNodeId } from "./types";

export type MusicTrack = "main" | "anxious" | "positive" | "sad";

/**
 * Background music per node, chosen by the mood of the scene:
 * main — calm narration, anxious — pressure and fraud,
 * positive — the best outcome, sad — friends split up or the search fails.
 */
export const sceneMusic: Record<StoryNodeId, MusicTrack> = {
  "01": "main",
  "02": "main",
  "03": "main",
  "04L": "main",
  "05L": "anxious",
  "06I": "main",
  "07I": "anxious",
  "08O": "main",
  "09O": "anxious",
  "10S": "anxious",
  "11N": "main",
  "12N": "main",
  "13N": "positive",
  F1: "sad",
  F2: "sad",
  F3: "sad",
  F4: "positive",
  F5: "main",
  F6: "sad",
  F7: "sad",
  F8: "sad",
  F9: "sad",
};
