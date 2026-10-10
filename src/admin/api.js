import { request } from "../api/client";

// Photos are resized before upload, but a slow connection still needs longer than a lookup.
const UPLOAD_TIMEOUT_MS = 30_000;
// The multipart field the API's upload middleware reads the image from.
const PHOTO_FIELD = "profilePicture";

/** Returns a successful response's `data`, or throws with the API's own explanation. */
function dataOf({ response, body }, fallback) {
  if (response.ok && body?.data) return body.data;
  // A 400's `error` says what to fix (e.g. the photo is too big); a 500's is a raw database error.
  const detail = response.status === 400 && typeof body?.error === "string" ? body.error : null;
  const message = body?.message || `${fallback} (HTTP ${response.status})`;
  throw new Error(detail ? `${message}: ${detail}` : message);
}

const photoForm = (photo, fields = {}) => {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) form.append(name, value);
  if (photo) form.append(PHOTO_FIELD, photo, "photo.jpg");
  return form;
};

/** The student registered to a card, with today's daily logs; null for an unknown card. */
export async function fetchStudent(rfid, { signal } = {}) {
  const result = await request(`/api/students/${encodeURIComponent(rfid)}`, { signal });
  if (result.response.status === 404 && result.body?.status === "error") return null;
  return dataOf(result, "Couldn't load the student").student;
}

/** Registers a student. Blank optional fields are sent as "", which the API stores as NULL. */
export async function createStudent(values, photo) {
  const result = await request("/api/students", {
    body: photoForm(photo, values),
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
  return dataOf(result, "Couldn't register the student").student;
}

/** Replaces a student's photo; the API deletes the old file. */
export async function replacePhoto(studentId, photo) {
  const result = await request(`/api/students/${studentId}/profile-picture`, {
    method: "PUT",
    body: photoForm(photo),
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
  return dataOf(result, "Couldn't update the photo").student;
}

/** "online", or "database-offline" when the API is up but can't reach Postgres. */
export async function fetchHealth({ signal } = {}) {
  const { body } = await request("/health-checks", { signal });
  return body?.data?.database === "connected" ? "online" : "database-offline";
}
