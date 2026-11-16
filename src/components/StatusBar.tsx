import { formatUAH } from "../story/stateChanges";
import type { GameState } from "../story/types";

const CRISIS_STRESS = 60;

type StatusBarProps = {
  state: Pick<GameState, "budgetUAH" | "stress">;
};

/** Always-visible budget and stress. Relationships are shown only when a choice changes them. */
export function StatusBar({ state }: StatusBarProps) {
  const level = state.stress >= 45 ? "high" : state.stress >= 30 ? "mid" : "low";

  return (
    <aside className="status-bar" aria-label="Показники">
      <p className="status-bar__budget">
        <span className="status-bar__label visually-hidden">Бюджет</span>
        <strong className="status-bar__value" key={state.budgetUAH}>
          {formatUAH(state.budgetUAH)}
        </strong>
      </p>
      <div
        className="status-bar__stress"
        role="meter"
        aria-label="Стрес"
        aria-valuemin={0}
        aria-valuemax={CRISIS_STRESS}
        aria-valuenow={Math.min(state.stress, CRISIS_STRESS)}
        aria-valuetext={`${state.stress} із ${CRISIS_STRESS}`}
      >
        <span className="status-bar__label visually-hidden">Стрес</span>
        <span className="status-bar__track">
          <span
            className={`status-bar__fill status-bar__fill--${level}`}
            style={{ width: `${Math.min(100, (state.stress / CRISIS_STRESS) * 100)}%` }}
          />
        </span>
        <strong className="status-bar__value" key={state.stress}>
          {state.stress}
          <small>/{CRISIS_STRESS}</small>
        </strong>
      </div>
    </aside>
  );
}
