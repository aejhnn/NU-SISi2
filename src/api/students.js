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
 * Calls an API path, POSTing `body` as JSON when given. Every API response is wrapped as
 * { status, statusCode, message, data }.
 */
async function request(path, { signal, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: body
      ? { Accept: "application/json", "Content-Type": "application/json" }
      : { Accept: "application/json" },
    body: body && JSON.stringify(body),
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])
      : AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const json = await response.json().catch(() => null);
  // The dev proxy answers 502 when nothing is listening on the API's port.
  if (!json && response.status >= 502 && response.status <= 504) {
    throw new Error(`Can't reach the API server (HTTP ${response.status}). Is NUSIS-I2 running?`);
  }
  return { response, body: json };
}

/** Every registered student (without daily logs). */
export async function fetchStudents({ signal } = {}) {
  const { response, body } = await request("/api/students", { signal });
  if (!response.ok || !Array.isArray(body?.data?.students)) {
    throw new Error(body?.message || `Student list failed (HTTP ${response.status})`);
  }
  return body.data.students;
}

/**
 * Records a card tap: the first tap of a visit is the student's Time In, the next their Time Out.
 * Resolves with the student and today's `dailyLogs`, this tap included; rejects with
 * StudentNotFoundError for unknown cards.
 */
export async function recordTap(rfid, { signal } = {}) {
  const { response, body } = await request("/api/daily-logs/tap", { signal, body: { rfidUid: rfid } });

  // A 404 without the response envelope means the route itself is missing, not that the card is unknown.
  if (response.status === 404 && body?.status === "error") throw new StudentNotFoundError(rfid);
  if (!response.ok || !body?.data?.student) {
    throw new Error(body?.message || `Recording tap failed (HTTP ${response.status})`);
  }
  return body.data.student;
}

const toDate = (value) => (value ? new Date(value) : null);

/** Maps an API student record onto the fields the dashboard displays. */
export function toIdentity(student) {
  // Today's logs arrive oldest first, so the last one is the student's current visit.
  const latestLog = student.dailyLogs?.at(-1);
  return {
    role: "Student",
    fullName: `${student.firstName} ${student.lastName}`.trim(),
    studentId: student.universityId,
    // Not in the students table yet; these light up once the API returns them.
    program: student.program ?? null,
    section: student.section ?? null,
    yearLevel: student.yearLevel ?? null,
    photoUrl: student.profilePicture ?? null,
    timeIn: toDate(latestLog?.timeIn),
    timeOut: toDate(latestLog?.timeOut),
  };
}
