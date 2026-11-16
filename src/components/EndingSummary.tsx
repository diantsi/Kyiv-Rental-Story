import { storyNodes } from "../story/story";
import { formatUAH } from "../story/stateChanges";
import type { GameState, StoryNode } from "../story/types";

type EndingSummaryProps = {
  scene: StoryNode;
  state: GameState;
  onRestart: () => void;
};

const choiceLabels = new Map(
  Object.values(storyNodes).flatMap((node) =>
    (node.choices ?? []).map((choice) => [choice.id, choice.label] as const),
  ),
);

export function EndingSummary({ scene, state, onRestart }: EndingSummaryProps) {
  const decisions = state.choices
    .map((id) => choiceLabels.get(id))
    .filter((label): label is string => Boolean(label));

  return (
    <section className="ending-panel ending-summary" aria-labelledby="ending-summary">
      <p className="ending-summary__eyebrow">Фінал</p>
      <h2 id="ending-summary">{scene.title}</h2>
      <p>{scene.consequence}</p>

      <dl className="ending-summary__stats">
        <div>
          <dt>Бюджет</dt>
          <dd>{formatUAH(state.budgetUAH)}</dd>
        </div>
        <div>
          <dt>Стрес</dt>
          <dd>{state.stress}</dd>
        </div>
        <div>
          <dt>Оля</dt>
          <dd>{state.oliaRelationship}</dd>
        </div>
        <div>
          <dt>Макс</dt>
          <dd>{state.maksRelationship}</dd>
        </div>
      </dl>

      {decisions.length > 0 && (
        <>
          <h3 className="ending-summary__subtitle">Ваші рішення</h3>
          <ol className="ending-summary__decisions">
            {decisions.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ol>
        </>
      )}

      <button className="primary-button" type="button" onClick={onRestart}>
        Почати спочатку
      </button>
    </section>
  );
}
