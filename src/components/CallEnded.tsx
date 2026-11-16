import { useEffect, useRef } from "react";
import callEndedScreen from "../assets/call_ended.png";

type CallEndedProps = {
  onDone: () => void;
};

const SHOW_MS = 2000;

/** "Call ended" phone screen: shows briefly after Marta hangs up; a click skips it. */
export function CallEnded({ onDone }: CallEndedProps) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timer = window.setTimeout(() => doneRef.current(), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="phone-call" role="dialog" aria-modal="true" aria-label="Дзвінок завершено" onClick={onDone}>
      <div className="phone-call__phone phone-call__phone--message">
        <img src={callEndedScreen} alt="" />
      </div>
    </div>
  );
}
