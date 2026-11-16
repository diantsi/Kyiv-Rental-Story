import type { DialogueBeat } from "../story/types";

type DialogueBoxProps = {
  beat: DialogueBeat;
  currentBeat?: number;
  totalBeats?: number;
};

export function DialogueBox({ beat }: DialogueBoxProps) {
  return (
    <section className="dialogue-box" aria-live="polite" aria-atomic="true">
      <div className="dialogue-heading">
        <h2 className="speaker-name" key={beat.speaker}>
          {beat.speaker}
        </h2>
      </div>
      <p className="dialogue-text" key={beat.text}>
        {beat.text}
      </p>
    </section>
  );
}
