import { useReducer } from "react";
import {
  gameReducer,
  initialGameState,
} from "../story/gameState";
import { walkingSkeletonNodes } from "../story/walkingSkeleton";
import type { StoryChoice } from "../story/types";
import { ChoiceList } from "./ChoiceList";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

export function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const scene = walkingSkeletonNodes[state.nodeId];
  const currentBeat = scene.beats[state.beatIndex];
  const isLastBeat = state.beatIndex === scene.beats.length - 1;

  function advanceDialogue() {
    dispatch({ type: "advance" });
  }

  function selectChoice(choice: StoryChoice) {
    dispatch({ type: "choose", choiceId: choice.id });
  }

  const showChoices = isLastBeat && scene.choices;
  const canAdvance = !isLastBeat || scene.nextNodeId;

  return (
    <SceneFrame scene={scene}>
      <DialogueBox
        beat={currentBeat}
        currentBeat={state.beatIndex + 1}
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
