import { useEffect, useReducer, useRef, useState } from "react";
import {
  gameReducer,
  getVisibleBeats,
} from "../story/gameState";
import { beatAsks } from "../story/asks";
import { choiceReactions } from "../story/reactions";
import { saveGameState } from "../story/gameStorage";
import { storyNodes } from "../story/story";
import type {
  ChatBubble,
  ChatReply,
  DialogueBeat,
  GameState,
  StoryChoice,
  StoryNodeId,
} from "../story/types";
import { playChooseSound, playSceneMusic, stopSceneMusic } from "../audio/sound";
import { sceneMusic } from "../story/sceneMusic";
import { ChoiceList } from "./ChoiceList";
import { ChangeToast, TOAST_STEP_MS } from "./ChangeToast";
import { EndingSummary } from "./EndingSummary";
import { StatusBar } from "./StatusBar";
import { diffState, flashTone, type StateChange } from "../story/stateChanges";
import { ContextSheet } from "./ContextSheet";
import { getBeatSprite } from "../story/characterSprites";
import { laptopIntroBackground } from "../story/sceneBackgrounds";
import { CallEnded } from "./CallEnded";
import { PhoneCall } from "./PhoneCall";
import { ListingModal } from "./ListingModal";
import { DevPanel, type DevView } from "./DevPanel";
import { DialogueBox } from "./DialogueBox";
import { SceneFrame } from "./SceneFrame";

// Every choice is Marta's decision, so she stands beside the options.
const CHOICE_BEAT: DialogueBeat = { speaker: "Марта", text: "", mood: "thinking" };

type GameScreenProps = {
  initialState: GameState;
  onRestart: () => void;
  onMenu: () => void;
  onShowTitle?: () => void;
};

export function GameScreen({ initialState, onRestart, onMenu, onShowTitle }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [devView, setDevView] = useState<DevView | null>(null);
  const preview = import.meta.env.DEV ? devView : null;
  const scene = storyNodes[preview?.nodeId ?? state.nodeId];
  const beats = preview ? scene.beats : getVisibleBeats(scene, state);
  const beatIndex = preview ? preview.beatIndex : state.beatIndex;
  const showingContext = preview ? preview.showingContext : state.showingContext;
  const currentBeat = beats[beatIndex];
  const isLastBeat = beatIndex === beats.length - 1;

  // UI-only step: the last line is shown first, the choice screen comes after "Далі".
  const [choosing, setChoosing] = useState(false);
  // UI-only: what people say right after a choice, shown on the scene the choice was made in.
  const [reaction, setReaction] = useState<{
    sceneId: StoryNodeId;
    beats: DialogueBeat[];
    index: number;
    /** Side questions: afterwards go back to the remaining questions (or on with the scene). */
    thenAsk?: boolean;
  } | null>(null);
  const [asking, setAsking] = useState(false);

  // Reactions to a choice still belong to the scene it was made in, so its music keeps playing.
  const musicTrack = sceneMusic[reaction?.sceneId ?? scene.id];
  useEffect(() => playSceneMusic(musicTrack), [musicTrack]);
  useEffect(() => stopSceneMusic, []);

  // Questions already asked, by `${sceneId}:${beatIndex}`; asked ones disappear from the list.
  const [askedLabels, setAskedLabels] = useState<Record<string, string[]>>({});
  const ask = beatAsks[`${scene.id}:${beatIndex}`];
  const askKey = `${scene.id}:${beatIndex}`;
  const remainingAsks = ask
    ? ask.options.filter((option) => !(askedLabels[askKey] ?? []).includes(option.label))
    : [];
  const [listingOpen, setListingOpen] = useState(false);

  // UI-only chat state: Marta's cosmetic replies by owner beat index, and whether options are open.
  const [chatReplies, setChatReplies] = useState<Record<number, ChatBubble[]>>({});
  const [replying, setReplying] = useState(false);

  // Laptop screen with the listing when a listing scene starts; the player may open it or skip.
  const [introDone, setIntroDone] = useState(false);
  const [endedDone, setEndedDone] = useState(false);
  const atSceneStart = !showingContext && beatIndex === 0 && !introDone;
  const showIntro = Boolean(scene.visual?.listing) && atSceneStart;
  const showCall =
    scene.visual?.call !== undefined &&
    !showingContext &&
    !introDone &&
    beatIndex === scene.visual.call.beforeBeat &&
    (!scene.visual.call.requiresFlag ||
      Boolean(preview) ||
      state.flags[scene.visual.call.requiresFlag]);
  const callEnded = scene.visual?.callEnded;
  const showEnded =
    callEnded !== undefined &&
    !showingContext &&
    !endedDone &&
    beatIndex === callEnded.beforeBeat &&
    (!callEnded.requiresFlag || Boolean(preview) || state.flags[callEnded.requiresFlag]);
  // Show the laptop screen again every time the scene's context sheet is entered.
  useEffect(() => {
    if (showingContext) {
      setIntroDone(false);
      setEndedDone(false);
      setChatReplies({});
      setAskedLabels({});
    }
  }, [scene.id, showingContext]);
  const stepKey = `${scene.id}:${beatIndex}`;
  useEffect(() => {
    setChoosing(false);
    setReplying(false);
    setAsking(false);
  }, [stepKey]);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // After any action that changes the numbers, tell the player what changed.
  const previousState = useRef(state);
  const [changes, setChanges] = useState<StateChange[]>([]);
  const [flash, setFlash] = useState<{ tone: "good" | "bad"; id: number } | null>(null);
  useEffect(() => {
    const diff = diffState(previousState.current, state);
    previousState.current = state;
    if (diff.length === 0) return;
    setChanges(diff);
    const tone = flashTone(diff);
    setFlash(tone ? { tone, id: Date.now() } : null);
    const timer = window.setTimeout(() => setChanges([]), diff.length * TOAST_STEP_MS + 200);
    return () => window.clearTimeout(timer);
  }, [state]);

  function advanceDialogue() {
    if (preview) {
      setDevView({ ...preview, showingContext: false, beatIndex: 0 });
      return;
    }
    dispatch({ type: "advance" });
  }

  function selectChoice(choice: StoryChoice) {
    if (preview) return;
    const beats = choiceReactions[choice.id];
    if (beats?.length) setReaction({ sceneId: scene.id, beats, index: 0 });
    dispatch({ type: "choose", choiceId: choice.id });
  }

  const devPanel = import.meta.env.DEV ? (
    <DevPanel view={devView} onChange={setDevView} onShowTitle={onShowTitle} />
  ) : null;
  const hud = (
    <>
      {flash && <div className={`flash flash--${flash.tone}`} key={flash.id} aria-hidden="true" />}
            <div className="hud-corner">
        <StatusBar state={state} />
        <button
          className={`menu-button${import.meta.env.DEV ? " menu-button--dev" : ""}`}
          type="button"
          onClick={onMenu}
        >
          <span className="menu-button__icon" aria-hidden="true" />
          Меню
        </button>
      </div>
      <ChangeToast changes={changes} />
    </>
  );

  if (reaction) {
    const reactionScene = storyNodes[reaction.sceneId];
    const reactionBeat = reaction.beats[reaction.index];
    const lastReaction = reaction.index === reaction.beats.length - 1;
    return (
      <>
        <SceneFrame scene={reactionScene} sprite={getBeatSprite(reactionBeat)}>
          <DialogueBox
            beat={reactionBeat}
            currentBeat={reaction.index + 1}
            totalBeats={reaction.beats.length}
          />
          <button
            className="primary-button next-button"
            type="button"
            onClick={() => {
              if (!lastReaction) {
                setReaction({ ...reaction, index: reaction.index + 1 });
                return;
              }
              setReaction(null);
              if (reaction.thenAsk) {
                // `remainingAsks` already excludes the question that was just answered.
                if (remainingAsks.length > 0) setAsking(true);
                else advanceBeat();
              }
            }}
          >
            Далі
          </button>
        </SceneFrame>
        {hud}
        {devPanel}
      </>
    );
  }

  if (showingContext) {
    return (
      <>
        <SceneFrame scene={scene} variant="context">
          <ContextSheet scene={scene} onContinue={advanceDialogue} />
        </SceneFrame>
        {hud}
        {devPanel}
      </>
    );
  }

  const chatConfig = scene.visual?.chat;
  const chatSpeaker = chatConfig?.speaker;
  const chatMessages: ChatBubble[] | undefined = chatSpeaker
    ? beats.slice(0, beatIndex + 1).flatMap((beat, index) => [
        ...(beat.speaker === chatSpeaker ? [{ text: beat.text }] : []),
        ...(chatReplies[index] ?? []),
      ])
    : undefined;
  const chatActive = Boolean(chatSpeaker) && currentBeat?.speaker === chatSpeaker;
  const pendingReplies = !chatReplies[beatIndex] ? chatConfig?.replies?.[beatIndex] : undefined;
  const chatOptions = replying ? pendingReplies : undefined;

  function sendChatReply(reply: ChatReply) {
    const bubbles: ChatBubble[] = [{ text: reply.text, mine: true }];
    if (reply.answer) bubbles.push({ text: reply.answer, delayed: true });
    setChatReplies((prev) => ({ ...prev, [beatIndex]: bubbles }));
    setReplying(false);
  }

  const lastBeatChoices = isLastBeat && scene.kind === "scene" ? scene.choices : undefined;
  const showChoices = choosing ? lastBeatChoices : undefined;
  const canAdvance =
    Boolean(lastBeatChoices) ||
    !isLastBeat ||
    (scene.kind === "scene" && Boolean(scene.nextNodeId));


  function advanceBeat() {
    if (preview) setDevView({ ...preview, beatIndex: Math.min(beatIndex + 1, beats.length - 1) });
    else advanceDialogue();
  }

  function pickAsk(label: string, replies: DialogueBeat[]) {
    setAsking(false);
    setAskedLabels((prev) => ({ ...prev, [askKey]: [...(prev[askKey] ?? []), label] }));
    setReaction({ sceneId: scene.id, beats: replies, index: 0, thenAsk: true });
  }

  function next() {
    if (ask && !asking) setAsking(true);
    else if (pendingReplies) setReplying(true);
    else if (lastBeatChoices) setChoosing(true);
    else if (preview) setDevView({ ...preview, beatIndex: Math.min(beatIndex + 1, beats.length - 1) });
    else advanceDialogue();
  }

  return (
    <>
    <SceneFrame
      scene={scene}
      sprite={getBeatSprite(showChoices || (asking && ask) ? CHOICE_BEAT : currentBeat)}
      onListing={() => setListingOpen(true)}
      chatMessages={chatMessages}
      backdrop={showChoices ? undefined : currentBeat?.backdrop}
      chatOptions={chatOptions}
      onChatReply={sendChatReply}
    >
      {showChoices ? (
        <ChoiceList choices={showChoices} onChoose={selectChoice} />
      ) : asking && ask ? (
        <section className="choice-panel" aria-labelledby="ask-heading">
          <h2 id="ask-heading">{ask.title}</h2>
          <div className="choice-list">
            {remainingAsks.map((option) => (
              <button
                className="choice-button"
                key={option.label}
                type="button"
                onClick={() => {
                  playChooseSound();
                  pickAsk(option.label, option.replies);
                }}
              >
                {option.label}
              </button>
            ))}
            <button
              className="choice-button"
              type="button"
              onClick={() => {
                playChooseSound();
                setAsking(false);
                advanceBeat();
              }}
            >
              Досить питань, ідемо далі
            </button>
          </div>
        </section>
      ) : (
        <>
          {!chatActive && !chatOptions && (
            <DialogueBox
              beat={currentBeat}
              currentBeat={beatIndex + 1}
              totalBeats={beats.length}
            />
          )}
          {canAdvance ? (
            !chatOptions && (
              <button className="primary-button next-button" type="button" onClick={next}>
                Далі
              </button>
            )
          ) : (
            scene.kind === "ending" ? (
              <EndingSummary scene={scene} state={state} onRestart={onRestart} />
            ) : (
              <div className="ending-overlay">
                <section
                  className="ending-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="ending-summary"
                >
                  <h2 id="ending-summary">Наслідок</h2>
                  <div className="ending-card__ornament" aria-hidden="true">✦</div>
                  <p className="ending-card__text">{scene.consequence}</p>
                  <button
                    className="primary-button ending-card__button"
                    type="button"
                    onClick={onRestart}
                  >
                    Почати спочатку
                  </button>
                </section>
              </div>
            )
          )}
        </>
      )}
    </SceneFrame>
    {showEnded && <CallEnded onDone={() => setEndedDone(true)} />}
    {showCall && <PhoneCall
        autoHangUp={scene.visual?.call?.autoHangUp}
        autoAnswer={scene.visual?.call?.autoAnswer}
        caller={scene.visual?.call?.caller}
        onAccept={() => setIntroDone(true)}
      />}
    {showIntro && (
      <div
        className="laptop-intro"
        style={{ backgroundImage: `url("${laptopIntroBackground}")` }}
      >
        <section className="choice-panel laptop-intro__panel" aria-labelledby="listing-heading">
          <h2 id="listing-heading">Оголошення на екрані</h2>
          <div className="choice-list">
            <button
              className="choice-button"
              type="button"
              onClick={() => setListingOpen(true)}
            >
              Переглянути оголошення
            </button>
            <button
              className="choice-button"
              type="button"
              onClick={() => setIntroDone(true)}
            >
              Не відкривати, одразу обговорити
            </button>
          </div>
        </section>
      </div>
    )}
    {listingOpen && (
      <ListingModal
        onClose={() => {
          setListingOpen(false);
          setIntroDone(true);
        }}
      />
    )}
    {hud}
    {devPanel}
    </>
  );
}
