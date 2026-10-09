import { useEffect, useRef } from "react";

// USB RFID readers present themselves as keyboards: on every tap they "type" the card serial
// in a burst a few milliseconds per key, usually followed by Enter. People type far slower,
// so anything with longer gaps between keys is ignored.
const MAX_KEY_GAP_MS = 80;
// Readers configured without an Enter suffix: treat a pause after the burst as the end.
const IDLE_COMMIT_MS = 200;
const MIN_SERIAL_LENGTH = 4;

const isEditable = (element) =>
  element instanceof HTMLElement &&
  (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName));

/** Calls `onScan(serial)` whenever a card is tapped on a keyboard-emulating RFID reader. */
export function useRfidScanner(onScan) {
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  });

  useEffect(() => {
    let buffer = "";
    let lastKeyAt = 0;
    let idleTimer;

    const commit = () => {
      clearTimeout(idleTimer);
      const serial = buffer;
      buffer = "";
      if (serial.length >= MIN_SERIAL_LENGTH) onScanRef.current(serial);
    };

    const handleKeyDown = (event) => {
      if (event.repeat || event.isComposing || event.ctrlKey || event.altKey || event.metaKey) return;
      if (isEditable(event.target)) return;

      if (event.key === "Enter" || event.key === "Tab") {
        if (buffer) {
          event.preventDefault();
          commit();
        }
        return;
      }
      if (event.key.length !== 1) return;

      if (event.timeStamp - lastKeyAt > MAX_KEY_GAP_MS) buffer = "";
      lastKeyAt = event.timeStamp;
      buffer += event.key;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(commit, IDLE_COMMIT_MS);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(idleTimer);
    };
  }, []);
}
