// Search, sorting and filtering run in the browser over the full list from GET /api/students.
// Once the API takes query parameters for these (see ADMIN.md, section 4), this is the one place
// to swap out.

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

const byLastName = (a, b) =>
  collator.compare(a.lastName, b.lastName) || collator.compare(a.firstName, b.firstName);
const byFirstName = (a, b) =>
  collator.compare(a.firstName, b.firstName) || collator.compare(a.lastName, b.lastName);

export const SORT_OPTIONS = [
  { value: "last-asc", label: "Last name, A–Z", compare: byLastName },
  { value: "last-desc", label: "Last name, Z–A", compare: (a, b) => byLastName(b, a) },
  { value: "first-asc", label: "First name, A–Z", compare: byFirstName },
  { value: "id-asc", label: "University ID", compare: (a, b) => collator.compare(a.universityId, b.universityId) },
  { value: "newest", label: "Newest registered", compare: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) },
];

export const PHOTO_FILTERS = [
  { value: "all", label: "Any photo status" },
  { value: "with", label: "With photo" },
  { value: "missing", label: "Missing photo" },
];

const searchableText = (student) =>
  [student.firstName, student.lastName, student.universityId, student.universityEmail, student.rfidUid]
    .join(" ")
    .toLowerCase();

/**
 * The students to list. Every word of `search` must appear somewhere in the student's name,
 * University ID, email or card, so "juan dela" and "2025 cruz" both work.
 */
export function selectStudents(students, { search, sort, photo }) {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  const compare = SORT_OPTIONS.find((option) => option.value === sort)?.compare ?? byLastName;
  return students
    .filter((student) => photo === "all" || (photo === "with") === Boolean(student.profilePicture))
    .filter((student) => {
      const text = searchableText(student);
      return words.every((word) => text.includes(word));
    })
    .sort(compare);
}

const CSV_COLUMNS = [
  ["University ID", (s) => s.universityId],
  ["Last name", (s) => s.lastName],
  ["First name", (s) => s.firstName],
  ["University email", (s) => s.universityEmail],
  ["RFID card", (s) => s.rfidUid],
  ["Contact number", (s) => s.contactNumber],
  ["Emergency contact number", (s) => s.emergencyContactNumber],
  ["Photo", (s) => (s.profilePicture ? "Yes" : "No")],
  ["Registered", (s) => s.createdAt],
];

// Spreadsheet apps run a cell that starts with one of these as a formula.
const FORMULA_START = /^[=+\-@\t\r]/;

const csvCell = (value) => {
  let text = value == null ? "" : String(value);
  if (FORMULA_START.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

/** The students as CSV, with a byte-order mark so Excel reads names like "Peña" correctly. */
export function toCsv(students) {
  const rows = [
    CSV_COLUMNS.map(([heading]) => heading),
    ...students.map((student) => CSV_COLUMNS.map(([, value]) => value(student))),
  ];
  return `﻿${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}
