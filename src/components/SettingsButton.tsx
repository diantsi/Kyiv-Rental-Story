import { useState } from "react";
import { createPortal } from "react-dom";
import { getVolume, playChooseSound, setVolume } from "../audio/sound";

type SettingsButtonProps = {
  relationships?: { olia: number; maks: number };
};

export function SettingsButton({ relationships }: SettingsButtonProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"sound" | "relations">("sound");
  const [volume, setLocal] = useState(getVolume);

  function change(key: "music" | "effects", value: number) {
    setVolume({ [key]: value });
    setLocal(getVolume());
  }

  return (
    <>
      <button
        className="settings-button"
        type="button"
        aria-label="Налаштування"
        onClick={() => setOpen(true)}
      >
        <span className="settings-button__icon" aria-hidden="true">⚙</span>
      </button>
      {open && createPortal(
        <div className="settings-overlay" onClick={() => setOpen(false)}>
          <section
            className="settings-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="settings-title">Налаштування</h2>
            {relationships && (
              <div className="settings-tabs" role="tablist">
                <button
                  className={`settings-tab${tab === "sound" ? " settings-tab--active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === "sound"}
                  onClick={() => setTab("sound")}
                >
                  Звук
                </button>
                <button
                  className={`settings-tab${tab === "relations" ? " settings-tab--active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === "relations"}
                  onClick={() => setTab("relations")}
                >
                  Стосунки
                </button>
              </div>
            )}
            {relationships && tab === "relations" && (
              <div className="settings-relations">
                
                {([["Оля", relationships.olia], ["Макс", relationships.maks]] as const).map(
                  ([name, value]) => (
                    <div className="settings-relation" key={name}>
                      <span>{name} <b>{value}</b></span>
                      <div
                        className="settings-relation__track"
                        role="progressbar"
                        aria-label={`Стосунки: ${name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={value}
                      >
                        <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
            {(!relationships || tab === "sound") && (<>
            <label className="settings-row">
              <span>Музика <b>{Math.round(volume.music * 100)}%</b></span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume.music * 100)}
                onChange={(event) => change("music", Number(event.target.value) / 100)}
              />
            </label>
            <label className="settings-row">
              <span>Звуки <b>{Math.round(volume.effects * 100)}%</b></span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume.effects * 100)}
                onChange={(event) => change("effects", Number(event.target.value) / 100)}
                onPointerUp={playChooseSound}
                onKeyUp={playChooseSound}
              />
            </label>
            </>)}
            <button className="settings-card__close" type="button" onClick={() => setOpen(false)}>
              Готово
            </button>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
