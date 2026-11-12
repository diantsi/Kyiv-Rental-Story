import { useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { MainMenu } from "./components/MainMenu";
import { createInitialGameState } from "./story/gameState";
import {
  clearGameState,
  loadGameState,
} from "./story/gameStorage";
import type { GameState } from "./story/types";

type AppScreen = "menu" | "game";

export function App() {
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [savedGame] = useState(loadGameState);
  const [activeGame, setActiveGame] = useState<GameState | null>(null);

  function startNewGame() {
    clearGameState();
    setActiveGame(createInitialGameState());
    setScreen("game");
  }

  function continueGame() {
    if (!savedGame) {
      startNewGame();
      return;
    }

    setActiveGame(savedGame);
    setScreen("game");
  }

  if (screen === "menu") {
    return (
      <MainMenu
        hasSavedGame={savedGame !== null}
        onContinue={continueGame}
        onStart={startNewGame}
      />
    );
  }

  return <GameScreen initialState={activeGame ?? createInitialGameState()} />;
}
