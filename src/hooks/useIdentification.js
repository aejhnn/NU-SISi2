import { useCallback, useEffect, useRef, useState } from "react";
import { RateLimitedError } from "../api/client";
import { StudentNotFoundError, recordTap, toIdentity } from "../api/students";
import { createRateLimiter } from "../lib/rateLimiter";
import { useRfidScanner } from "./useRfidScanner";
import { useStudentRoster } from "./useStudentRoster";

// How long a result stays up before the kiosk returns to its idle preview, so the next
// person in line never sees someone else's details.
const SHOW_STUDENT_MS = 15_000;
const SHOW_NOTICE_MS = 5_000;
// Readers can report one card several times (a double tap, or a card left on the reader), and
// every recorded tap toggles Time In/Out, so repeats of the same card are ignored for a while.
const REPEAT_TAP_MS = 10_000;
// The API limits requests per client IP, and the kiosk's roster refresh shares that budget with
// its taps, so taps are capped well below it. Only a stuck reader or someone cycling through
// cards gets near this.
const MAX_TAPS_PER_MINUTE = 60;

const IDLE = { status: "idle", identity: null, notice: null };

const rateLimited = (waitMs) => {
  const seconds = Math.ceil(waitMs / 1000);
  return {
    status: "rate-limited",
    identity: null,
    notice: {
      title: "Too many taps",
      detail: `Please wait ${seconds} second${seconds === 1 ? "" : "s"}, then tap your ID again.`,
    },
  };
};

/**
 * Listens for card taps, records each one as a Time In or Time Out, and shows the student.
 * status: "idle" | "loading" | "found" | "not-found" | "rate-limited" | "error"
 * While "loading", `identity` is already set if the card was found in the roster.
 */
export function useIdentification() {
  const [scan, setScan] = useState(IDLE);
  const pendingRef = useRef(null);
  const lastTapRef = useRef(null);
  const [tapLimiter] = useState(() =>
    createRateLimiter({ limit: MAX_TAPS_PER_MINUTE, windowMs: 60_000 }),
  );
  const roster = useStudentRoster();

  const handleTap = useCallback(
    async (serial) => {
      const now = Date.now();
      const last = lastTapRef.current;
      if (last?.serial === serial && now - last.at < REPEAT_TAP_MS) return;
      // A newer tap always wins over one that is still in flight, even one that can't be sent.
      pendingRef.current?.abort();
      const waitMs = tapLimiter.take(now);
      if (waitMs > 0) {
        setScan(rateLimited(waitMs));
        return;
      }
      const tap = { serial, at: now };
      lastTapRef.current = tap;

      const controller = new AbortController();
      pendingRef.current = controller;
      const scannedAt = new Date(now);
      // Registered cards are shown straight from the roster while the server records the tap
      // and returns today's times.
      const known = roster?.get(serial);

      setScan((previous) => ({
        status: "loading",
        identity: known ? { ...known, scannedAt } : previous.identity,
        notice: null,
      }));
      try {
        const student = await recordTap(serial, { signal: controller.signal });
        setScan({
          status: "found",
          identity: { ...toIdentity(student), scannedAt },
          notice: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        // The tap didn't go through, so the same card may try again right away.
        if (lastTapRef.current === tap) lastTapRef.current = null;
        if (error instanceof RateLimitedError) {
          // Every tap until the server's limit resets would be refused too.
          tapLimiter.pauseFor(error.retryAfterMs);
          setScan(rateLimited(error.retryAfterMs));
          return;
        }
        const notFound = error instanceof StudentNotFoundError;
        if (!notFound) console.error("Recording tap failed:", error);
        setScan({
          status: notFound ? "not-found" : "error",
          identity: null,
          notice: notFound
            ? { title: "Card not recognized", detail: `Card ${serial} isn't linked to a student record.` }
            : { title: "Tap not recorded", detail: "Please tap your ID again in a moment." },
        });
      }
    },
    [roster, tapLimiter],
  );

  useRfidScanner(handleTap);

  useEffect(() => {
    if (scan.status === "idle" || scan.status === "loading") return;
    const timer = setTimeout(() => setScan(IDLE), scan.status === "found" ? SHOW_STUDENT_MS : SHOW_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [scan]);

  useEffect(() => () => pendingRef.current?.abort(), []);

  return scan;
}
