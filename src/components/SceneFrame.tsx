import type { PropsWithChildren } from "react";
import viberChat from "../assets/viber_chat.png";
import { beatBackdrops, sceneBackgrounds } from "../story/sceneBackgrounds";
import type { ChatBubble, ChatReply, StoryNode } from "../story/types";

type SceneFrameProps = PropsWithChildren<{
  scene: StoryNode;
  variant?: "dialogue" | "context";
  sprite?: { src: string; side: "left" | "right" };
  onListing?: () => void;
  chatMessages?: ChatBubble[];
  backdrop?: keyof typeof beatBackdrops;
  chatOptions?: ChatReply[];
  onChatReply?: (reply: ChatReply) => void;
}>;

export function SceneFrame({
  scene,
  variant = "dialogue",
  sprite,
  onListing,
  chatMessages,
  backdrop,
  chatOptions,
  onChatReply,
  children,
}: SceneFrameProps) {
  const backdropKey = backdrop ?? (variant === "context" ? scene.visual?.contextBackdrop : undefined);
  const image =
    (backdropKey ? beatBackdrops[backdropKey] : undefined) ??
    scene.visual?.backgroundImage ??
    sceneBackgrounds[scene.id];
  const backgroundImage = image
    ? `linear-gradient(180deg, rgba(8, 12, 16, 0.16), rgba(8, 12, 16, 0.8)), url("${image}")`
    : undefined;

  return (
    <main
      className={`scene-frame scene-frame--${variant}`}
      style={{
        backgroundColor: scene.visual?.backgroundColor,
        backgroundImage,
      }}
    >
      {variant === "context" ? (
        children
      ) : (
        <>
          <header className="scene-header" />
          {scene.visual?.listing && onListing && (
            <button className="listing-button" type="button" onClick={onListing}>
              Переглянути оголошення
            </button>
          )}
          {scene.visual?.chat && (
            <div className="chat-phone" role="log" aria-label="Чат у Viber">
              <img src={viberChat} alt="" />
              <div className="chat-phone__screen">
                <div className="chat-phone__messages">
                  {(chatMessages ?? []).map((bubble, index) => (
                    <p
                      className={`chat-phone__bubble${bubble.mine ? " chat-phone__bubble--mine" : ""}${
                        bubble.delayed ? " chat-phone__bubble--delayed" : ""
                      }`}
                      key={index}
                    >
                      {bubble.text}
                    </p>
                  ))}
                </div>
                {chatOptions && chatOptions.length > 0 && (
                  <div className="chat-phone__options">
                    {chatOptions.map((reply) => (
                      <button
                        className="chat-phone__option"
                        key={reply.text}
                        type="button"
                        onClick={() => onChatReply?.(reply)}
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {sprite && <img
              className={`scene-sprite scene-sprite--${sprite.side}`}
              key={sprite.src}
              src={sprite.src}
              alt=""
            />}
          <div className={`story-controls story-controls--${sprite?.side ?? "center"}`}>
            {children}
          </div>
        </>
      )}
    </main>
  );
}
