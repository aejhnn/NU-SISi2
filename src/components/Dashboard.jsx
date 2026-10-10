import AnniversaryMark from "./brand/AnniversaryMark";
import LiveClock from "./LiveClock";
import StudentPhoto from "./StudentPhoto";
import { formatTime, formatYearLevel } from "../lib/format";

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-sm font-bold uppercase leading-[1.2] lg:text-[1.43rem]">
        {label}
      </dt>
      <dd className="mt-1 text-xl leading-[1.2] lg:mt-1.25 lg:text-[1.72rem]">
        {children}
      </dd>
    </div>
  );
}

function Notice({ title, detail }) {
  return (
    <div
      role="alert"
      className="absolute inset-0 z-10 grid place-items-center bg-canvas/40 p-4 backdrop-blur-sm motion-safe:animate-reveal"
    >
      <div className="max-w-136 rounded-2xl border border-white/80 bg-white/90 px-8 py-7 text-center shadow-[0_1.5rem_4rem_-1rem_rgb(20_26_51/0.35)] lg:px-12 lg:py-10">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mx-auto size-12 text-[#d63b3b] lg:size-16"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
          <path
            d="M12 7v6m0 3.5v.01"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-4 text-2xl font-extrabold lg:text-[2.25rem]">
          {title}
        </p>
        <p className="mt-2 text-base text-balance text-ink-muted lg:text-[1.375rem]">
          {detail}
        </p>
      </div>
    </div>
  );
}

function Dashboard({ person, watermark, notice, revealKey }) {
  const programAndSection = [person.program, person.section]
    .filter(Boolean)
    .join(" - ");

  return (
    <>
      <section
        aria-label="Identification details"
        className="relative flex flex-1 flex-col justify-center py-6 lg:py-0"
      >
        <AnniversaryMark className="mb-4 w-24 self-end lg:absolute lg:top-6.5 lg:right-0 lg:mb-0 lg:w-37" />

        <div
          key={revealKey}
          className="grid items-center gap-8 motion-safe:animate-reveal lg:grid-cols-[5fr_6fr] lg:gap-x-6"
        >
          <div className="flex justify-center">
            <StudentPhoto
              src={person.photoUrl}
              alt={`Photo of ${person.fullName}`}
              watermark={watermark}
              className="w-52 sm:w-60 lg:w-[20.4rem]"
            />
          </div>
          <dl className="grid gap-5 text-center lg:gap-[1.68rem] lg:text-left">
            <Field label="Full Name">{person.fullName}</Field>
            <Field label="Student ID">{person.studentId}</Field>
            <Field label="Program & Section">{programAndSection || "—"}</Field>
            <Field label="Year Level">
              {person.yearLevel ? formatYearLevel(person.yearLevel) : "—"}
            </Field>
          </dl>
        </div>

        {notice && <Notice title={notice.title} detail={notice.detail} />}
      </section>

      <footer className="border-t border-hairline pt-6 text-center lg:pt-9.5">
        <p className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base font-semibold uppercase leading-none lg:gap-x-13 lg:text-[1.5625rem]">
          <span>Time In: {formatTime(person.timeIn)}</span>
          <span>Time Out: {formatTime(person.timeOut)}</span>
        </p>
        <p className="mt-4 text-[1.375rem] font-extrabold uppercase leading-none tabular-nums sm:text-3xl lg:mt-8 lg:text-[2.45rem]">
          Current Time: <LiveClock className="block sm:inline" />
        </p>
      </footer>
    </>
  );
}

export default Dashboard;
