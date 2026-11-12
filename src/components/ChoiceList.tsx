import type { StoryChoice } from "../story/types";

type ChoiceListProps = {
  choices: StoryChoice[];
  onChoose: (choice: StoryChoice) => void;
};

export function ChoiceList({ choices, onChoose }: ChoiceListProps) {
  return (
    <section className="choice-panel" aria-labelledby="choice-heading">
      <h2 id="choice-heading">Що запропонує Марта?</h2>
      <div className="choice-list">
        {choices.map((choice) => (
          <button
            className="choice-button"
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </section>
  );
}
