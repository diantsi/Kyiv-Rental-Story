import startButton from "../assets/start_button.png";

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
  return (
    <main className="main-menu">
      <h1 className="visually-hidden">Київська оренда</h1>
      <section className="menu-panel" aria-label="Меню">
        <div className="menu-actions">
          {hasSavedGame ? (
            <>
              <button
                className="primary-button"
                type="button"
                onClick={onContinue}
              >
                Продовжити
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={onStart}
              >
                Почати спочатку
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
