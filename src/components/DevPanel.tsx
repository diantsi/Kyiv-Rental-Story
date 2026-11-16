import { useState } from "react";
import { storyNodes } from "../story/story";
import type { StoryNodeId } from "../story/types";

export type DevView = {
  nodeId: StoryNodeId;
  showingContext: boolean;
  beatIndex: number;
};

type DevPanelProps = {
  view: DevView | null;
  onChange: (view: DevView | null) => void;
  onShowTitle?: () => void;
};

const nodeIds = Object.keys(storyNodes) as StoryNodeId[];

/**
 * Developer-only preview controls. They change only what is rendered:
 * the game state, the save and all effects stay untouched.
 */
export function DevPanel({ view, onChange, onShowTitle }: DevPanelProps) {
  const [open, setOpen] = useState(true);
  const nodeIndex = view ? nodeIds.indexOf(view.nodeId) : -1;

  function goToNode(index: number) {
    const id = nodeIds[(index + nodeIds.length) % nodeIds.length];
    onChange({ nodeId: id, showingContext: true, beatIndex: 0 });
  }

  function step(delta: number) {
    if (!view) return;
    const beatCount = storyNodes[view.nodeId].beats.length;
    if (view.showingContext) {
      if (delta > 0) onChange({ ...view, showingContext: false, beatIndex: 0 });
      else goToNode(nodeIndex - 1);
      return;
    }
    const next = view.beatIndex + delta;
    if (next < 0) onChange({ ...view, showingContext: true, beatIndex: 0 });
    else if (next >= beatCount) goToNode(nodeIndex + 1);
    else onChange({ ...view, beatIndex: next });
  }

  if (!open) {
    return (
      <button className="dev-panel dev-panel--closed" type="button" onClick={() => setOpen(true)}>
        DEV
      </button>
    );
  }

  return (
    <aside className="dev-panel" aria-label="Developer preview">
      <div className="dev-panel__row">
        <strong>DEV preview</strong>
        <button type="button" onClick={() => setOpen(false)}>×</button>
      </div>
      <div className="dev-panel__row">
        <button type="button" onClick={onShowTitle}>заставка</button>
      </div>
      <div className="dev-panel__row">
        <select
          value={view?.nodeId ?? ""}
          onChange={(e) =>
            e.target.value
              ? onChange({ nodeId: e.target.value as StoryNodeId, showingContext: true, beatIndex: 0 })
              : onChange(null)
          }
        >
          <option value="">— реальна гра —</option>
          {nodeIds.map((id) => (
            <option key={id} value={id}>
              {id} · {storyNodes[id].title}
            </option>
          ))}
        </select>
      </div>
      {view && (
        <>
          <div className="dev-panel__row">
            <button type="button" onClick={() => goToNode(nodeIndex - 1)}>⏮ сцена</button>
            <button type="button" onClick={() => step(-1)}>◀</button>
            <button type="button" onClick={() => step(1)}>▶</button>
            <button type="button" onClick={() => goToNode(nodeIndex + 1)}>сцена ⏭</button>
          </div>
          <div className="dev-panel__row">
            <button
              type="button"
              onClick={() => onChange({ ...view, showingContext: !view.showingContext, beatIndex: 0 })}
            >
              {view.showingContext ? "до діалогу" : "до опису"}
            </button>
            <span>
              {view.showingContext ? "опис" : `репліка ${view.beatIndex + 1}/${storyNodes[view.nodeId].beats.length}`}
            </span>
          </div>
        </>
      )}
    </aside>
  );
}
