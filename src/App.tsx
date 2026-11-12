import { useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { MainMenu } from "./components/MainMenu";

type AppScreen = "menu" | "game";

export function App() {
  const [screen, setScreen] = useState<AppScreen>("menu");

  if (screen === "menu") {
    return <MainMenu onStart={() => setScreen("game")} />;
  }

  return <GameScreen />;
}
