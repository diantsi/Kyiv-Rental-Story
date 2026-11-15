import type { StoryNode } from "../story/types";

type ContextSheetProps = {
  scene: StoryNode;
  onContinue: () => void;
};

export function ContextSheet({ scene, onContinue }: ContextSheetProps) {
  return (
    <section className="context-sheet" aria-label="Контекст сцени">
      <span className="context-tape" aria-hidden="true" />
      {(scene.location || scene.time) && (
        <p className="context-meta">
          {scene.location}
          {scene.location && scene.time ? <span aria-hidden="true"> · </span> : null}
          {scene.time}
        </p>
      )}
      <p className="context-text">{scene.description}</p>
      <button className="context-button" type="button" onClick={onContinue}>
        Далі
      </button>
    </section>
  );
}
