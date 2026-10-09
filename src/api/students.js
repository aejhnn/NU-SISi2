// Empty by default: in development Vite proxies /api to the API server (see vite.config.js).
// Set VITE_API_BASE_URL when the dashboard is hosted somewhere other than the API.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const REQUEST_TIMEOUT_MS = 8000;

export class StudentNotFoundError extends Error {
  constructor(rfid) {
    super(`No student is registered to card ${rfid}`);
    this.name = "StudentNotFoundError";
  }
}

/**
 * Looks up the student whose `refidUid` matches the scanned card.
 * Resolves with the API's student record; rejects with StudentNotFoundError for unknown cards.
 */
export async function fetchStudentByRfid(rfid, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/api/students/rfid/${encodeURIComponent(rfid)}`, {
    headers: { Accept: "application/json" },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
      : AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  // Every API response is wrapped as { status, statusCode, message, data }. A 404 without that
  // envelope means the route itself is missing, not that the card is unknown.
  const body = await response.json().catch(() => null);
  if (response.status === 404 && body?.status === "error") throw new StudentNotFoundError(rfid);
  if (!response.ok || !body?.data?.student) {
    throw new Error(body?.message || `Student lookup failed (HTTP ${response.status})`);
  }
  return body.data.student;
}

/** Maps an API student record onto the fields the dashboard displays. */
export function toIdentity(student) {
  return {
    role: "Student",
    fullName: `${student.firstName} ${student.lastName}`.trim(),
    studentId: student.universityId,
    // Not in the students table yet; these light up once the API returns them.
    program: student.program ?? null,
    section: student.section ?? null,
    yearLevel: student.yearLevel ?? null,
    photoUrl: student.profilePictureUrl ?? null,
  };
}
