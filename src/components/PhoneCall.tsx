import { useEffect, useRef, useState } from "react";
import callScreen from "../assets/larysa_call.png";
import unknownCallScreen from "../assets/unknown_call.png";
import messageScreen from "../assets/larysa_message.png";
import lockScreen from "../assets/phone_lock.png";
import notification from "../assets/notification_larysa.png";
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

/**
 * Incoming call from Larysa. The phone is a picture, the buttons are real
 * buttons laid over it. With autoHangUp it plays on its own: ring, message, done.
 */
export function PhoneCall({ onAccept, autoHangUp, autoAnswer, caller = "larysa" }: PhoneCallProps) {
  const [ringKey, setRingKey] = useState(0);
  // Larysa's message skips the call screen: the lock screen buzzes, a banner arrives, then the message.
  const [stage, setStage] = useState<"ring" | "lock" | "message">(autoHangUp ? "lock" : "ring");
  const showMessage = stage === "message";
  const onAcceptRef = useRef(onAccept);
  onAcceptRef.current = onAccept;

  useEffect(() => {
    if (!autoAnswer) return;
    const timer = window.setTimeout(() => onAcceptRef.current(), RING_MS);
    return () => window.clearTimeout(timer);
  }, [autoAnswer]);

  useEffect(() => {
    if (!autoHangUp || stage !== "ring") return;
    const timer = window.setTimeout(() => setStage("lock"), RING_MS);
    return () => window.clearTimeout(timer);
  }, [autoHangUp, stage]);

  // The lock screen vibrates when the notification arrives.
  useEffect(() => {
    if (stage !== "lock") return;
    try {
      navigator.vibrate?.([200, 120, 200]);
    } catch {
      /* vibration is optional */
    }
  }, [stage]);

  // The ringtone plays while the phone rings; declining restarts it, the lock screen stops it.
  useEffect(() => {
    if (stage !== "ring") return;
    startPhoneRinging();
    return stopPhoneRinging;
  }, [stage, ringKey]);

  // Auto mode: a click skips the ring. The lock and message screens wait for the player.
  function skip() {
    if (autoAnswer) {
      onAccept();
      return;
    }
    if (autoHangUp && stage === "ring") setStage("lock");
  }

  const label =
    stage === "lock"
      ? "Нове повідомлення від рієлторки Лариси"
      : showMessage
        ? "Повідомлення від рієлторки Лариси"
        : caller === "unknown"
          ? "Вхідний дзвінок: невідомий номер"
          : "Вхідний дзвінок: рієлторка Лариса";

  return (
    <div className="phone-call" role="dialog" aria-modal="true" aria-label={label} onClick={skip}>
      <div
        className={`phone-call__phone${
          stage === "message" ? " phone-call__phone--message" : ""
        }${stage === "lock" ? " phone-call__phone--lock" : ""}`}
        key={`${ringKey}-${stage}`}
      >
        <img
          src={
            stage === "lock"
              ? lockScreen
              : showMessage
                ? messageScreen
                : caller === "unknown"
                  ? unknownCallScreen
                  : callScreen
          }
          alt=""
        />
        {stage === "lock" && (
          <img className="phone-call__banner" src={notification} alt="" />
        )}
        {stage === "ring" && !autoHangUp && !autoAnswer && (
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
      {stage === "lock" && (
        <button className="primary-button phone-call__view" type="button" onClick={() => setStage("message")}>
          Переглянути
        </button>
      )}
      {showMessage && (
        <button className="primary-button phone-call__ignore" type="button" onClick={onAccept}>
          Проігнорувати
        </button>
      )}
    </div>
  );
}
