import type { DialogueBeat } from "../story/types";

type DialogueBoxProps = {
  beat: DialogueBeat;
  currentBeat: number;
  totalBeats: number;
};

export function DialogueBox({
  beat,
  currentBeat,
  totalBeats,
}: DialogueBoxProps) {
  return (
    <section className="dialogue-box" aria-live="polite" aria-atomic="true">
      <div className="dialogue-heading">
        <h2 className="speaker-name">{beat.speaker}</h2>
        <span className="beat-count" aria-label={`Репліка ${currentBeat} із ${totalBeats}`}>
          {currentBeat}/{totalBeats}
        </span>
      </div>
      <p className="dialogue-text">{beat.text}</p>
    </section>
  );
}
