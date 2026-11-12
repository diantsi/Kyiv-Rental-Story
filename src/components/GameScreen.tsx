import { useState } from "react";
import {
  initialNodeId,
  walkingSkeletonNodes,
} from "../story/walkingSkeleton";
import type { StoryChoice } from "../story/types";
import { ChoiceList } from "./ChoiceList";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

export function GameScreen() {
  const [nodeId, setNodeId] = useState(initialNodeId);
  const [beatIndex, setBeatIndex] = useState(0);
  const scene = walkingSkeletonNodes[nodeId];
  const currentBeat = scene.beats[beatIndex];
  const isLastBeat = beatIndex === scene.beats.length - 1;

  function openNode(nextNodeId: string) {
    setNodeId(nextNodeId);
    setBeatIndex(0);
  }

  function advanceDialogue() {
    if (!isLastBeat) {
      setBeatIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (scene.nextNodeId) {
      openNode(scene.nextNodeId);
    }
  }

  function selectChoice(choice: StoryChoice) {
    openNode(choice.nextNodeId);
  }

  const showChoices = isLastBeat && scene.choices;
  const canAdvance = !isLastBeat || scene.nextNodeId;

  return (
    <SceneFrame scene={scene}>
      <DialogueBox
        beat={currentBeat}
        currentBeat={beatIndex + 1}
        totalBeats={scene.beats.length}
      />

      {showChoices ? (
        <ChoiceList choices={showChoices} onChoose={selectChoice} />
      ) : canAdvance ? (
        <button className="primary-button next-button" type="button" onClick={advanceDialogue}>
          Далі
        </button>
      ) : (
        <p className="sample-complete" role="status">
          Кінець демонстраційного фрагмента.
        </p>
      )}
    </SceneFrame>
  );
}
