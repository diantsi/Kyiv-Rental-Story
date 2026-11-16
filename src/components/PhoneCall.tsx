import { useEffect, useRef, useState } from "react";
import callScreen from "../assets/larysa_call.png";
import unknownCallScreen from "../assets/unknown_call.png";
import messageScreen from "../assets/larysa_message.png";
import { startPhoneRinging, stopPhoneRinging } from "../audio/sound";

type PhoneCallProps = {
  onAccept: () => void;
  /** Larysa hangs up herself and her text message appears; the player makes no choice. */
  autoHangUp?: boolean;
  /** Marta picks up on her own after a few rings; the conversation then plays as dialogue. */
  autoAnswer?: boolean;
  /** Who is calling: Larysa by name, or an unknown number. */
  caller?: "larysa" | "unknown";
};

const RING_MS = 2600;
const MESSAGE_MS = 3600;

/**
 * Incoming call from Larysa. The phone is a picture, the buttons are real
 * buttons laid over it. With autoHangUp it plays on its own: ring, message, done.
 */
export function PhoneCall({ onAccept, autoHangUp, autoAnswer, caller = "larysa" }: PhoneCallProps) {
  const [ringKey, setRingKey] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const onAcceptRef = useRef(onAccept);
  onAcceptRef.current = onAccept;

  useEffect(() => {
    if (!autoAnswer) return;
    const timer = window.setTimeout(() => onAcceptRef.current(), RING_MS);
    return () => window.clearTimeout(timer);
  }, [autoAnswer]);

  useEffect(() => {
    if (!autoHangUp) return;
    const timer = window.setTimeout(
      () => (showMessage ? onAcceptRef.current() : setShowMessage(true)),
      showMessage ? MESSAGE_MS : RING_MS,
    );
    return () => window.clearTimeout(timer);
  }, [autoHangUp, showMessage]);

  // The ringtone plays while the phone rings; declining restarts it, the message stops it.
  useEffect(() => {
    if (showMessage) return;
    startPhoneRinging();
    return stopPhoneRinging;
  }, [showMessage, ringKey]);

  // Auto mode: a click skips ahead.
  function skip() {
    if (autoAnswer) {
      onAccept();
      return;
    }
    if (!autoHangUp) return;
    if (showMessage) onAccept();
    else setShowMessage(true);
  }

  return (
    <div
      className="phone-call"
      role="dialog"
      aria-modal="true"
      aria-label={
        showMessage
          ? "Повідомлення від рієлторки Лариси"
          : caller === "unknown"
            ? "Вхідний дзвінок: невідомий номер"
            : "Вхідний дзвінок: рієлторка Лариса"
      }
      onClick={skip}
    >
      <div
        className={`phone-call__phone${showMessage ? " phone-call__phone--message" : ""}`}
        key={`${ringKey}-${showMessage}`}
      >
        <img src={showMessage ? messageScreen : caller === "unknown" ? unknownCallScreen : callScreen} alt="" />
        {!autoHangUp && !autoAnswer && (
          <>
            <button
              className="phone-call__button phone-call__button--decline"
              type="button"
              aria-label="Відхилити"
              onClick={() => setRingKey((key) => key + 1)}
            />
            <button
              className="phone-call__button phone-call__button--accept"
              type="button"
              aria-label="Відповісти"
              onClick={onAccept}
            />
          </>
        )}
      </div>
    </div>
  );
}
