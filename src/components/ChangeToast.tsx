import { useEffect, useState } from "react";
import type { StateChange } from "../story/stateChanges";

type ChangeToastProps = {
  changes: StateChange[];
};

/** How long each change stays on screen before the next one appears. */
export const TOAST_STEP_MS = 1500;

/**
 * Feedback right after a choice: what changed and by how much.
 * Shown one change at a time, in order, in the middle of the screen. Never blocks input.
 */
export function ChangeToast({ changes }: ChangeToastProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (changes.length === 0) return;
    const timer = window.setInterval(() => {
      setIndex((current) => current + 1);
    }, TOAST_STEP_MS);
    return () => window.clearInterval(timer);
  }, [changes]);

  const change = changes[index];
  if (!change) return null;

  return (
    <div className="change-toast" role="status" aria-live="polite">
      <div
        className={`change-toast__item change-toast__item--${change.tone}${
          change.id === "olia" || change.id === "maks"
            ? change.tone === "bad"
              ? " change-toast__item--broken"
              : " change-toast__item--warm"
            : change.id === "stress" && change.tone === "good"
              ? " change-toast__item--calm"
              : change.id === "stress"
                ? " change-toast__item--tense"
                : change.id === "budget" && change.tone === "bad"
                  ? " change-toast__item--spent"
                  : ""
        }`}
        key={`${change.id}-${index}`}
        style={{ ["--toast-ms" as string]: `${TOAST_STEP_MS}ms` }}
      >
        <span className="change-toast__label">{change.label}</span>
        <strong className="change-toast__value">
          <span className="change-toast__arrow" aria-hidden="true">
            {change.tone === "good" ? "▲" : "▼"}
          </span>
          {change.text}
        </strong>
      </div>
    </div>
  );
}
