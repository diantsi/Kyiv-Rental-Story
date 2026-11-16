import { useEffect, useState } from "react";
import { lampOffBackground } from "../story/sceneBackgrounds";
import type { StoryNode } from "../story/types";

type ContextSheetProps = {
  scene: StoryNode;
  onContinue: () => void;
};

const TITLE_DURATION_MS = 3200;
const CHARS_PER_SECOND = 45;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ContextSheet({ scene, onContinue }: ContextSheetProps) {
  const place = [scene.location, scene.time].filter(Boolean).join(" · ");
  const [showTitle, setShowTitle] = useState(Boolean(place));

  // The location card shows first, then gives way to the sheet.
  useEffect(() => {
    setShowTitle(Boolean(place));
    if (!place) return;
    const timer = window.setTimeout(() => setShowTitle(false), TITLE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [scene.id, place]);

  useEffect(() => {
    if (!showTitle) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setShowTitle(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTitle]);

  // Preload the lights-off picture while the location card is on screen.
  useEffect(() => {
    if (scene.visual?.effect === "lamp-flicker") new Image().src = lampOffBackground;
  }, [scene.visual?.effect]);

  const text = scene.description;
  const [shown, setShown] = useState(0);
  const done = shown >= text.length;

  // Typewriter reveal; starts once the location card is gone.
  useEffect(() => {
    if (showTitle) return;
    if (prefersReducedMotion()) {
      setShown(text.length);
      return;
    }
    setShown(0);
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const count = Math.floor(((performance.now() - startedAt) / 1000) * CHARS_PER_SECOND);
      setShown(Math.min(count, text.length));
      if (count >= text.length) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
  }, [showTitle, text]);

  if (showTitle) {
    return (
      <div
        className="location-card"
        role="button"
        tabIndex={0}
        aria-label={place}
        onClick={() => setShowTitle(false)}
      >
        <p className="location-card__text">{place}</p>
      </div>
    );
  }

  return (
    <>
    {scene.visual?.effect === "lamp-flicker" && (
      <div className="lamp-stage" aria-hidden="true">
        <div className="lamp-stage__dark">
          <div
            className="lamp-stage__world"
            style={{ backgroundImage: `url("${lampOffBackground}")` }}
          />
          <div className="lamp-stage__shade" />
        </div>
        <div className="lamp-stage__world lamp-stage__world--glow">
          <div className="lamp-stage__glow" />
        </div>
      </div>
    )}
    <section
      className="context-sheet"
      aria-label="Контекст сцени"
      onClick={() => setShown(text.length)}
    >
      <span className="context-tape" aria-hidden="true" />
      <p className="context-text">
        <span className="visually-hidden">{text}</span>
        <span aria-hidden="true">
          {text.slice(0, shown)}
          <span className="context-text__rest">{text.slice(shown)}</span>
        </span>
      </p>
      <button
        className="context-button"
        type="button"
        style={{ opacity: done ? 1 : 0.55 }}
        onClick={(event) => {
          event.stopPropagation();
          onContinue();
        }}
      >
        Далі
      </button>
    </section>
    </>
  );
}
