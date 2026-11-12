import { useEffect, useReducer } from "react";
import {
  gameReducer,
  getVisibleBeats,
} from "../story/gameState";
import { saveGameState } from "../story/gameStorage";
import { storyNodes } from "../story/story";
import type { GameState, StoryChoice } from "../story/types";
import { ChoiceList } from "./ChoiceList";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

type GameScreenProps = {
  initialState: GameState;
  onRestart: () => void;
};

export function GameScreen({ initialState, onRestart }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const scene = storyNodes[state.nodeId];
  const beats = getVisibleBeats(scene, state);
  const currentBeat = beats[state.beatIndex];
  const isLastBeat = state.beatIndex === beats.length - 1;

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  function advanceDialogue() {
    dispatch({ type: "advance" });
  }

  function selectChoice(choice: StoryChoice) {
    dispatch({ type: "choose", choiceId: choice.id });
  }

  const showChoices = isLastBeat && scene.kind === "scene" && scene.choices;
  const canAdvance =
    !isLastBeat || (scene.kind === "scene" && Boolean(scene.nextNodeId));

  return (
    <SceneFrame scene={scene}>
      <DialogueBox
        beat={currentBeat}
        currentBeat={state.beatIndex + 1}
        totalBeats={beats.length}
      />

      {showChoices ? (
        <ChoiceList choices={showChoices} onChoose={selectChoice} />
      ) : canAdvance ? (
        <button className="primary-button next-button" type="button" onClick={advanceDialogue}>
          Далі
        </button>
      ) : (
        <section className="ending-panel" aria-labelledby="ending-summary">
          <h2 id="ending-summary">Наслідок</h2>
          <p>{scene.consequence}</p>
          <button className="primary-button" type="button" onClick={onRestart}>
            Почати спочатку
          </button>
        </section>
      )}
    </SceneFrame>
  );
}
