import { useState } from "react";
import { formatTime } from "../../lib/format";
import { formatDate } from "../lib/format";
import { useReplacePhoto, useStudent } from "../queries";
import Banner from "./Banner";
import PhotoField from "./PhotoField";
import { SheetBody } from "./Sheet";
import { button, linkStyles } from "./styles";

const time = (value) => formatTime(new Date(value));

function Detail({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-medium">{children ?? <span className="text-ink-muted">—</span>}</dd>
    </div>
  );
}

function PresenceBadge({ logs }) {
  const latest = logs.at(-1);
  const [label, style] = !latest
    ? ["Not in today", "bg-canvas text-ink-muted"]
    : latest.timeOut
      ? [`Left at ${time(latest.timeOut)}`, "bg-navy/8 text-navy-ink"]
      : [`On campus since ${time(latest.timeIn)}`, "bg-success/10 text-success"];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}

/** Today's taps, from the per-card lookup (the student list doesn't carry logs). */
function TodayLogs({ query }) {
  if (query.isPending) return <p className="text-sm text-ink-muted">Loading today's taps…</p>;
  if (query.isError) return <p className="text-sm text-danger">Couldn't load today's taps: {query.error.message}</p>;
  const logs = query.data?.dailyLogs ?? [];
  if (logs.length === 0) return <p className="text-sm text-ink-muted">No taps today.</p>;
  return (
    <ol className="divide-y divide-hairline rounded-lg border border-hairline">
      {logs.map((log) => (
        <li key={log.logId} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm tabular-nums">
          <span>
            <span className="text-ink-muted">In</span> {time(log.timeIn)}
          </span>
          <span>
            {log.timeOut ? (
              <>
                <span className="text-ink-muted">Out</span> {time(log.timeOut)}
              </>
            ) : (
              <span className="text-success">Still on campus</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StudentProfile({ student, notice }) {
  const today = useStudent(student.rfidUid);
  const replacePhoto = useReplacePhoto();
  const [photo, setPhoto] = useState(null);
  const [photoSaved, setPhotoSaved] = useState(false);
  const fullName = `${student.firstName} ${student.lastName}`;

  const choosePhoto = (picked) => {
    setPhoto(picked);
    setPhotoSaved(false);
    replacePhoto.reset();
  };
  const savePhoto = () =>
    replacePhoto.mutate(
      { studentId: student.studentId, photo: photo.blob },
      {
        onSuccess: () => {
          setPhoto(null);
          setPhotoSaved(true);
        },
      },
    );

  return (
    <SheetBody>
      {notice && <Banner tone="success">{notice}</Banner>}

      <section aria-label="Photo" className="space-y-3">
        <PhotoField
          photo={photo}
          savedUrl={student.profilePicture}
          onChange={choosePhoto}
          alt={`Photo of ${fullName}`}
          disabled={replacePhoto.isPending}
        />
        {photo && (
          <div className="flex items-center gap-3">
            <button type="button" onClick={savePhoto} disabled={replacePhoto.isPending} className={button("primary")}>
              {replacePhoto.isPending ? "Saving…" : student.profilePicture ? "Replace photo" : "Save photo"}
            </button>
            <p className="text-xs text-ink-muted">Not saved yet.</p>
          </div>
        )}
        {replacePhoto.error && (
          <Banner tone="danger" title="Couldn't save the photo">
            {replacePhoto.error.message}
          </Banner>
        )}
        {photoSaved && <Banner tone="success">Photo saved.</Banner>}
      </section>

      <section aria-labelledby="profile-details">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="profile-details" className="text-xs font-bold uppercase tracking-wide text-navy-ink">
            Details
          </h3>
          {today.data && <PresenceBadge logs={today.data.dailyLogs ?? []} />}
        </div>
        <dl className="mt-2 divide-y divide-hairline border-y border-hairline">
          <Detail label="Name">{fullName}</Detail>
          <Detail label="University ID">
            <span className="tabular-nums">{student.universityId}</span>
          </Detail>
          <Detail label="University email">
            <a href={`mailto:${student.universityEmail}`} className={linkStyles}>
              {student.universityEmail}
            </a>
          </Detail>
          <Detail label="RFID card">
            <span className="font-mono tabular-nums">{student.rfidUid}</span>
          </Detail>
          <Detail label="Contact number">
            {student.contactNumber && (
              <a href={`tel:${student.contactNumber}`} className={linkStyles}>
                {student.contactNumber}
              </a>
            )}
          </Detail>
          <Detail label="Emergency contact">
            {student.emergencyContactNumber && (
              <a href={`tel:${student.emergencyContactNumber}`} className={linkStyles}>
                {student.emergencyContactNumber}
              </a>
            )}
          </Detail>
          <Detail label="Registered">{formatDate(student.createdAt)}</Detail>
        </dl>
      </section>

      <section aria-labelledby="profile-today" className="space-y-3">
        <h3 id="profile-today" className="text-xs font-bold uppercase tracking-wide text-navy-ink">
          Today
        </h3>
        <TodayLogs query={today} />
      </section>
    </SheetBody>
  );
}

export default StudentProfile;
