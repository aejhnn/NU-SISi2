const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

/** "Oct 9, 2026" */
export const formatDate = (value) => dateFormat.format(new Date(value));

/** Today as YYYY-MM-DD in local time, for file names. */
export const isoDate = (date = new Date()) => new Intl.DateTimeFormat("en-CA").format(date);
