const clockFormat = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** 07:28:53 PM */
export const formatClock = (date) => clockFormat.format(date);

/** 7:28 PM, or a placeholder when there is no punch yet. */
export const formatTime = (date) => (date ? timeFormat.format(date) : "--:--");

const ordinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });
const ordinalSuffix = { one: "st", two: "nd", few: "rd", other: "th" };

/** 2 → "2nd Year" */
export const formatYearLevel = (level) =>
  `${level}${ordinalSuffix[ordinalRules.select(level)]} Year`;

// The school year rolls over in August.
const ACADEMIC_YEAR_START_MONTH = 7; // 0-based, so 7 = August

/** "2026-2027" for any date between August 2026 and July 2027. */
export function getAcademicYear(date = new Date()) {
  const startYear =
    date.getMonth() >= ACADEMIC_YEAR_START_MONTH ? date.getFullYear() : date.getFullYear() - 1;
  return `${startYear}-${startYear + 1}`;
}
