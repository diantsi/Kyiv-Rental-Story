import type { GameState } from "./types";

export type StateChange = {
  id: "budget" | "stress" | "olia" | "maks";
  label: string;
  text: string;
  tone: "good" | "bad";
  /** Raw numeric change (UAH for the budget). */
  delta: number;
};

export function formatUAH(value: number) {
  return `${value.toLocaleString("uk-UA").replace(/\s/g, " ")} грн`;
}

function signed(value: number) {
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`;
}

type Tracked = Pick<
  GameState,
  "budgetUAH" | "stress" | "oliaRelationship" | "maksRelationship"
>;

/** What the player should be told after an action: only values that actually changed. */
export function diffState(prev: Tracked, next: Tracked): StateChange[] {
  const changes: StateChange[] = [];

  const budget = next.budgetUAH - prev.budgetUAH;
  if (budget !== 0) {
    changes.push({
      id: "budget",
      label: "Бюджет",
      text: `${budget > 0 ? "+" : "−"}${formatUAH(Math.abs(budget))}`,
      tone: budget > 0 ? "good" : "bad",
      delta: budget,
    });
  }

  const stress = next.stress - prev.stress;
  if (stress !== 0) {
    changes.push({
      id: "stress",
      label: "Стрес",
      text: signed(stress),
      tone: stress > 0 ? "bad" : "good",
      delta: stress,
    });
  }

  const olia = next.oliaRelationship - prev.oliaRelationship;
  if (olia !== 0) {
    changes.push({
      id: "olia",
      label: "Оля",
      text: signed(olia),
      tone: olia > 0 ? "good" : "bad",
      delta: olia,
    });
  }

  const maks = next.maksRelationship - prev.maksRelationship;
  if (maks !== 0) {
    changes.push({
      id: "maks",
      label: "Макс",
      text: signed(maks),
      tone: maks > 0 ? "good" : "bad",
      delta: maks,
    });
  }

  return changes;
}

/** A short screen flash for a big swing: "bad" for a heavy blow, "good" for a clear win. */
export function flashTone(changes: StateChange[]): "good" | "bad" | undefined {
  const heavyBlow = changes.some(
    (change) =>
      (change.id === "stress" && change.delta >= 10) ||
      (change.id === "budget" && change.delta <= -5000) ||
      ((change.id === "olia" || change.id === "maks") && change.delta <= -8),
  );
  if (heavyBlow) return "bad";

  const win = changes.some(
    (change) =>
      ((change.id === "olia" || change.id === "maks") && change.delta >= 5) ||
      (change.id === "stress" && change.delta <= -5),
  );
  return win ? "good" : undefined;
}
