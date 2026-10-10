import { useId, useRef, useState } from "react";
import { useCreateStudent } from "../queries";
import { STUDENT_FIELDS, validateStudent } from "../lib/validation";
import Banner from "./Banner";
import PhotoField from "./PhotoField";
import { SheetBody, SheetFooter } from "./Sheet";
import { button, inputStyles } from "./styles";

const EMPTY = Object.fromEntries(STUDENT_FIELDS.map((field) => [field, ""]));

function Field({ label, name, value, error, hint, optional = false, focusOnOpen = false, onValueChange, ...inputProps }) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(event) => onValueChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        data-autofocus={focusOnOpen || undefined}
        className={`${inputStyles} mt-1.5`}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className={`mt-1.5 text-xs ${error ? "text-danger" : "text-ink-muted"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 text-xs font-bold uppercase tracking-wide text-navy-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

/** Registers a student, optionally with a photo, and hands the created record to `onCreated`. */
function StudentForm({ students, initialRfid = "", notice, onCreated, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, rfidUid: initialRfid });
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const formRef = useRef(null);
  const create = useCreateStudent();

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };
  const field = (name) => ({ name, value: values[name], error: errors[name], onValueChange: setValue });

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = Object.fromEntries(STUDENT_FIELDS.map((name) => [name, values[name].trim()]));
    const found = validateStudent(trimmed, students);
    setErrors(found);
    const firstInvalid = STUDENT_FIELDS.find((name) => found[name]);
    if (firstInvalid) {
      formRef.current.elements[firstInvalid].focus();
      return;
    }
    create.mutate({ values: trimmed, photo: photo?.blob }, { onSuccess: onCreated });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <SheetBody>
        {notice && <Banner>{notice}</Banner>}
        {create.error && (
          <Banner tone="danger" title="Couldn't register the student">
            {create.error.message}
          </Banner>
        )}

        <Section title="RFID card">
          <Field
            {...field("rfidUid")}
            label="Card number"
            hint="Click here, then tap the student's card on the reader."
            maxLength={15}
            autoComplete="off"
            focusOnOpen={!initialRfid}
            className={`${inputStyles} mt-1.5 font-mono tabular-nums`}
            onKeyDown={(event) => {
              // Readers end each card with Enter, which would otherwise submit the half-filled form.
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.form.elements.firstName.focus();
              }
            }}
          />
        </Section>

        <Section title="Student">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field {...field("firstName")} label="First name" maxLength={50} autoComplete="off" focusOnOpen={Boolean(initialRfid)} />
            <Field {...field("lastName")} label="Last name" maxLength={50} autoComplete="off" />
          </div>
          <Field {...field("universityId")} label="University ID" placeholder="2025-1234567" maxLength={20} autoComplete="off" />
          <Field
            {...field("universityEmail")}
            label="University email"
            type="email"
            placeholder="delacruzj@students.nu-cebu.edu.ph"
            maxLength={255}
            autoComplete="off"
          />
        </Section>

        <Section title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field {...field("contactNumber")} label="Contact number" type="tel" optional maxLength={20} />
            <Field {...field("emergencyContactNumber")} label="Emergency contact" type="tel" optional maxLength={20} />
          </div>
        </Section>

        <Section title="Photo (optional)">
          <PhotoField
            photo={photo}
            onChange={setPhoto}
            alt="Photo of the new student"
            disabled={create.isPending}
          />
        </Section>
      </SheetBody>

      <SheetFooter>
        <button type="button" onClick={onCancel} className={button("secondary")}>
          Cancel
        </button>
        <button type="submit" disabled={create.isPending} className={button("primary")}>
          {create.isPending ? "Registering…" : "Register student"}
        </button>
      </SheetFooter>
    </form>
  );
}

export default StudentForm;
