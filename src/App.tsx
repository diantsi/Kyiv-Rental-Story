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
    const [savedGame, setSavedGame] = useState(loadGameState);
  const [activeGame, setActiveGame] = useState<GameState | null>(null);
  const [gameSession, setGameSession] = useState(0);
  // Dev only: title screen opened from the dev panel; the game stays mounted.
  const [titlePreview, setTitlePreview] = useState(false);

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

    function goToMenu() {
    setSavedGame(loadGameState());
    setScreen("menu");
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

  const showTitle = import.meta.env.DEV && titlePreview;

  return (
    <>
      <div hidden={showTitle}>
        <GameScreen
          key={gameSession}
          initialState={activeGame ?? createInitialGameState()}
          onRestart={startNewGame}
          onMenu={goToMenu}
          onShowTitle={() => setTitlePreview(true)}
        />
      </div>
      {showTitle && (
        <>
          <MainMenu hasSavedGame={false} onContinue={() => {}} onStart={() => {}} />
          <button
            className="dev-panel dev-panel--closed"
            type="button"
            onClick={() => setTitlePreview(false)}
          >
            DEV: назад до сцен
          </button>
        </>
      )}
    </>
  );
}
