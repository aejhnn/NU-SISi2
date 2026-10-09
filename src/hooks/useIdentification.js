import { useCallback, useEffect, useRef, useState } from "react";
import { StudentNotFoundError, fetchStudentByRfid, toIdentity } from "../api/students";
import { useRfidScanner } from "./useRfidScanner";

// How long a result stays up before the kiosk returns to its idle preview, so the next
// person in line never sees someone else's details.
const SHOW_STUDENT_MS = 15_000;
const SHOW_NOTICE_MS = 5_000;

const IDLE = { status: "idle", identity: null, notice: null };

/**
 * Listens for card taps and resolves them to a student.
 * status: "idle" | "loading" | "found" | "not-found" | "error"
 */
export function useIdentification() {
  const [scan, setScan] = useState(IDLE);
  const pendingRef = useRef(null);

  const lookUp = useCallback(async (serial) => {
    // A newer tap always wins over a lookup that is still in flight.
    pendingRef.current?.abort();
    const controller = new AbortController();
    pendingRef.current = controller;
    const scannedAt = new Date();

    setScan((previous) => ({ ...previous, status: "loading", notice: null }));
    try {
      const student = await fetchStudentByRfid(serial, { signal: controller.signal });
      setScan({
        status: "found",
        identity: { ...toIdentity(student), timeIn: scannedAt, timeOut: null },
        notice: null,
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      const notFound = error instanceof StudentNotFoundError;
      setScan({
        status: notFound ? "not-found" : "error",
        identity: null,
        notice: notFound
          ? { title: "Card not recognized", detail: `Card ${serial} isn't linked to a student record.` }
          : { title: "Can't verify right now", detail: "Please tap your ID again in a moment." },
      });
      if (!notFound) console.error("RFID lookup failed:", error);
    }
  }, []);

  useRfidScanner(lookUp);

  useEffect(() => {
    if (scan.status === "idle" || scan.status === "loading") return;
    const timer = setTimeout(() => setScan(IDLE), scan.status === "found" ? SHOW_STUDENT_MS : SHOW_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [scan]);

  useEffect(() => () => pendingRef.current?.abort(), []);

  return scan;
}
