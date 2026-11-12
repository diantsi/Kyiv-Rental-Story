import type { PropsWithChildren } from "react";
import type { StoryNode } from "../story/types";

type SceneFrameProps = PropsWithChildren<{
  scene: StoryNode;
}>;

export function SceneFrame({ scene, children }: SceneFrameProps) {
  const backgroundImage = scene.visual?.backgroundImage
    ? `linear-gradient(180deg, rgba(8, 12, 16, 0.16), rgba(8, 12, 16, 0.8)), url("${scene.visual.backgroundImage}")`
    : undefined;

  return (
    <main
      className="scene-frame"
      style={{
        backgroundColor: scene.visual?.backgroundColor,
        backgroundImage,
      }}
    >
      <header className="scene-header">
        <p className="scene-number">Сцена {scene.id}</p>
        <h1>{scene.title}</h1>
        {(scene.location || scene.time) && (
          <p className="scene-meta">
            {scene.location}
            {scene.location && scene.time ? <span aria-hidden="true"> · </span> : null}
            {scene.time}
          </p>
        )}
      </header>
      <div className="story-controls">{children}</div>
    </main>
  );
}
