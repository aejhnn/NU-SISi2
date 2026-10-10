import { useEffect, useMemo, useState } from "react";
import { useRfidScanner } from "../hooks/useRfidScanner";
import AdminHeader from "./components/AdminHeader";
import { CardIcon, DownloadIcon, PlusIcon, SearchIcon } from "./components/icons";
import { Sheet } from "./components/Sheet";
import StudentForm from "./components/StudentForm";
import StudentProfile from "./components/StudentProfile";
import StudentTable from "./components/StudentTable";
import { button, inputStyles } from "./components/styles";
import { PHOTO_FILTERS, SORT_OPTIONS, selectStudents, toCsv } from "./lib/directory";
import { isoDate } from "./lib/format";
import { useStudents } from "./queries";

const DEFAULT_FILTERS = { search: "", sort: "last-asc", photo: "all" };

function downloadCsv(csv, filename) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  // Revoking right away can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const countLabel = (shown, total) => {
  const noun = total === 1 ? "student" : "students";
  return shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;
};

function AdminApp() {
  useEffect(() => {
    document.title = "NU Cebu · Student Admin";
  }, []);

  const studentsQuery = useStudents();
  const students = studentsQuery.data;
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // null, { type: "profile", studentId, notice? } or { type: "register", rfidUid?, notice? }
  const [panel, setPanel] = useState(null);

  const visible = useMemo(() => selectStudents(students ?? [], filters), [students, filters]);
  const setFilter = (name) => (event) => setFilters((current) => ({ ...current, [name]: event.target.value }));
  const closePanel = () => setPanel(null);

  // Tapping a card on the reader opens that student, or starts registering an unknown card.
  // While registering, the card number field takes taps instead.
  useRfidScanner((serial) => {
    if (!students || panel?.type === "register") return;
    const match = students.find((student) => student.rfidUid === serial);
    setPanel(
      match
        ? { type: "profile", studentId: match.studentId }
        : {
            type: "register",
            rfidUid: serial,
            notice: `Card ${serial} isn't registered yet. Fill in the student's details to register it.`,
          },
    );
  });

  const profileStudent =
    panel?.type === "profile" ? students?.find((student) => student.studentId === panel.studentId) : null;

  return (
    <div className="min-h-dvh">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {students ? countLabel(visible.length, students.length) : "Loading students…"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadCsv(toCsv(visible), `nu-cebu-students-${isoDate()}.csv`)}
              disabled={visible.length === 0}
              className={button("secondary")}
            >
              <DownloadIcon />
              Export CSV
            </button>
            <button type="button" onClick={() => setPanel({ type: "register" })} className={button("primary")}>
              <PlusIcon />
              Register student
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-hairline p-3 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search students</span>
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                value={filters.search}
                onChange={setFilter("search")}
                placeholder="Search name, University ID, email or card"
                className={`${inputStyles} pl-9`}
              />
            </label>
            <div className="flex gap-3">
              <label className="flex flex-1 items-center gap-2 text-sm">
                <span className="text-ink-muted max-sm:sr-only">Sort</span>
                <select value={filters.sort} onChange={setFilter("sort")} className={`${inputStyles} md:w-44`}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-1 items-center gap-2 text-sm">
                <span className="sr-only">Photo</span>
                <select value={filters.photo} onChange={setFilter("photo")} className={`${inputStyles} md:w-44`}>
                  {PHOTO_FILTERS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <StudentTable
            query={studentsQuery}
            students={visible}
            onOpen={(student) => setPanel({ type: "profile", studentId: student.studentId })}
            onClearFilters={() => setFilters(DEFAULT_FILTERS)}
            onRegister={() => setPanel({ type: "register" })}
          />
        </div>

        <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
          <CardIcon className="size-4" />
          Tap a card on the reader to open that student, or to register a new card.
        </p>
      </main>

      {panel?.type === "register" && (
        <Sheet title="Register student" onClose={closePanel}>
          <StudentForm
            students={students ?? []}
            initialRfid={panel.rfidUid}
            notice={panel.notice}
            onCancel={closePanel}
            onCreated={(student) =>
              setPanel({
                type: "profile",
                studentId: student.studentId,
                notice: `${student.firstName} ${student.lastName} is registered. Their card works at the kiosk now.`,
              })
            }
          />
        </Sheet>
      )}
      {profileStudent && (
        <Sheet title={`${profileStudent.firstName} ${profileStudent.lastName}`} onClose={closePanel}>
          {/* Keyed so switching students (e.g. by tapping another card) starts from a clean slate. */}
          <StudentProfile key={profileStudent.studentId} student={profileStudent} notice={panel.notice} />
        </Sheet>
      )}
    </div>
  );
}

export default AdminApp;
