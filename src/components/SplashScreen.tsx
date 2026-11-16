import { unlockAudio } from "../audio/sound";

type SplashScreenProps = {
  onStart: () => void;
};

/**
 * Browsers block sound until the first interaction, so the game opens with
 * this screen: one click (or Enter/Space) unlocks audio and shows the menu.
 */
export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <button
      className="splash-screen"
      type="button"
      autoFocus
      onClick={() => {
        unlockAudio();
        onStart();
      }}
    >
      <span className="splash-screen__text">Натисніть, щоб почати</span>
    </button>
  );
}
