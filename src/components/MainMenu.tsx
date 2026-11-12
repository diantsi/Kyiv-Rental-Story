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
      <section className="menu-panel" aria-labelledby="game-title">
        <p className="eyebrow">Інтерактивна історія</p>
        <h1 id="game-title">Київська оренда</h1>
        <p className="menu-summary">
          Інтерактивна вебновела про трьох друзів, обмежений бюджет і квартири,
          які майже завжди мають приховане «але».
        </p>
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
            <button className="primary-button" type="button" onClick={onStart}>
              Почати гру
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
