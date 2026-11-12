type MainMenuProps = {
  onStart: () => void;
};

export function MainMenu({ onStart }: MainMenuProps) {
  return (
    <main className="main-menu">
      <section className="menu-panel" aria-labelledby="game-title">
        <p className="eyebrow">Інтерактивна історія</p>
        <h1 id="game-title">Київська оренда</h1>
        <p className="menu-summary">
          Інтерактивна вебновела про трьох друзів, обмежений бюджет і квартири,
          які майже завжди мають приховане «але».
        </p>
        <button className="primary-button" type="button" onClick={onStart}>
          Почати гру
        </button>
      </section>
    </main>
  );
}
