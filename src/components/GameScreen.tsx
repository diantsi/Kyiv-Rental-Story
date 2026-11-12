import { useEffect, useReducer } from "react";
import {
  gameReducer,
} from "../story/gameState";
import { saveGameState } from "../story/gameStorage";
import { walkingSkeletonNodes } from "../story/walkingSkeleton";
import type { GameState, StoryChoice } from "../story/types";
import { ChoiceList } from "./ChoiceList";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

type GameScreenProps = {
  initialState: GameState;
};

export function GameScreen({ initialState }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const scene = walkingSkeletonNodes[state.nodeId];
  const currentBeat = scene.beats[state.beatIndex];
  const isLastBeat = state.beatIndex === scene.beats.length - 1;

  useEffect(() => {
    saveGameState(state);
  }, [state]);

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
