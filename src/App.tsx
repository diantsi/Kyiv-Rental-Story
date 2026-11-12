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
  const [gameSession, setGameSession] = useState(0);

  function startNewGame() {
    clearGameState();
    setActiveGame(createInitialGameState());
    setGameSession((session) => session + 1);
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

  return (
    <GameScreen
      key={gameSession}
      initialState={activeGame ?? createInitialGameState()}
      onRestart={startNewGame}
    />
  );
}
