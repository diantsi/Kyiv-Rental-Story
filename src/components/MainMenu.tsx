import { useEffect } from "react";
import continueButton from "../assets/continue_button.png";
import restartButton from "../assets/restart_button.png";
import startButton from "../assets/start_button.png";
import { startMenuMusic } from "../audio/sound";

type MainMenuProps = {
  hasSavedGame: boolean;
  onContinue: () => void;
  onStart: () => void;
};

export function MainMenu({
  hasSavedGame,
  onContinue,
  onStart,
}: MainMenuProps) {
  useEffect(() => startMenuMusic(), []);

  return (
    <main className="main-menu">
      <h1 className="visually-hidden">Київська оренда</h1>
      <section className="menu-panel" aria-label="Меню">
        <div className="menu-actions">
          {hasSavedGame ? (
            <>
              <button
                className="image-button"
                type="button"
                aria-label="Продовжити"
                onClick={onContinue}
              >
                <img src={continueButton} alt="" />
              </button>
              <button
                className="image-button image-button--small"
                type="button"
                aria-label="Почати спочатку"
                onClick={onStart}
              >
                <img src={restartButton} alt="" />
              </button>
            </>
          ) : (
            <button
              className="image-button"
              type="button"
              aria-label="Почати гру"
              onClick={onStart}
            >
              <img src={startButton} alt="" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
