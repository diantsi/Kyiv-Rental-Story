import type { StateChange } from "../story/stateChanges";

type ChangeToastProps = {
  changes: StateChange[];
};

/** Feedback right after a choice: what changed and by how much. Never blocks input. */
export function ChangeToast({ changes }: ChangeToastProps) {
  if (changes.length === 0) return null;

  return (
    <ul className="change-toast" role="status" aria-live="polite">
      {changes.map((change) => (
        <li className={`change-toast__item change-toast__item--${change.tone}`} key={change.id}>
          <span>{change.label}</span>
          <strong>{change.text}</strong>
        </li>
      ))}
    </ul>
  );
}
