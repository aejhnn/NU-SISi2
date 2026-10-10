export const STUDENT_FIELDS = [
  "rfidUid",
  "firstName",
  "lastName",
  "universityId",
  "universityEmail",
  "contactNumber",
  "emergencyContactNumber",
];
const REQUIRED = new Set(["rfidUid", "firstName", "lastName", "universityId", "universityEmail"]);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

const lower = (value) => value.toLowerCase();

/**
 * Checks a new student's (trimmed) values against each other and the students already registered.
 * The database also rejects duplicates, but the API reports that as a bare 500, so duplicates are
 * caught here with a message that says who already has the card, ID or email.
 */
export function validateStudent(values, students) {
  const errors = {};
  for (const field of STUDENT_FIELDS) {
    if (REQUIRED.has(field) && !values[field]) errors[field] = "Required.";
  }
  if (values.universityEmail && !EMAIL.test(values.universityEmail)) {
    errors.universityEmail = "Enter an email address, e.g. delacruzj@students.nu-cebu.edu.ph.";
  }
  for (const field of ["contactNumber", "emergencyContactNumber"]) {
    if (values[field] && !PHONE.test(values[field])) {
      errors[field] = "Enter a phone number, e.g. 0917 123 4567.";
    }
  }

  const checkTaken = (field, normalize = (value) => value) => {
    if (errors[field] || !values[field]) return;
    const value = normalize(values[field]);
    const owner = students.find((student) => student[field] && normalize(student[field]) === value);
    if (owner) errors[field] = `Already registered to ${owner.firstName} ${owner.lastName}.`;
  };
  checkTaken("rfidUid");
  checkTaken("universityId", lower);
  checkTaken("universityEmail", lower);

  return errors;
}
