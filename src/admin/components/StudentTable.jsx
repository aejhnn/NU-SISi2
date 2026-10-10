import { useState } from "react";
import { formatDate } from "../lib/format";
import { button } from "./styles";

function Avatar({ student }) {
  // Remember a URL that failed to load so a broken link falls back to initials.
  const [failedSrc, setFailedSrc] = useState(null);
  const src = student.profilePicture;
  if (src && src !== failedSrc) {
    return <img src={src} alt="" onError={() => setFailedSrc(src)} className="size-9 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-navy/10 text-xs font-bold text-navy">
      {student.firstName.charAt(0)}
      {student.lastName.charAt(0)}
    </span>
  );
}

function SkeletonRows() {
  return Array.from({ length: 6 }, (_, row) => (
    <tr key={row}>
      <td colSpan={5} className="px-4 py-3">
        <div className="flex items-center gap-3 motion-safe:animate-pulse">
          <span className="size-9 rounded-full bg-hairline" />
          <span className="h-3 w-48 rounded bg-hairline" />
        </div>
      </td>
    </tr>
  ));
}

function EmptyState({ title, children }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-semibold">{title}</p>
      <div className="mt-1 text-sm text-ink-muted">{children}</div>
    </div>
  );
}

const headerCell = "px-4 py-3 font-semibold";

/** The students list. `query` is the list query; `students` the filtered, sorted rows to show. */
function StudentTable({ query, students, onOpen, onClearFilters, onRegister }) {
  if (query.isError) {
    return (
      <EmptyState title="Couldn't load students">
        <p>{query.error.message}</p>
        <button type="button" onClick={() => query.refetch()} className={`${button("secondary")} mt-4`}>
          Try again
        </button>
      </EmptyState>
    );
  }
  if (query.data?.length === 0) {
    return (
      <EmptyState title="No students registered yet">
        <button type="button" onClick={onRegister} className={`${button("primary")} mt-4`}>
          Register the first student
        </button>
      </EmptyState>
    );
  }
  if (query.data && students.length === 0) {
    return (
      <EmptyState title="No students match">
        <p>Try a different name, University ID, email or card number.</p>
        <button type="button" onClick={onClearFilters} className={`${button("secondary")} mt-4`}>
          Clear search and filters
        </button>
      </EmptyState>
    );
  }

  return (
    // Phones show name and University ID only; the scroll is a fallback for very narrow screens.
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-hairline bg-canvas/60 text-xs uppercase tracking-wide text-ink-muted">
          <tr>
            <th scope="col" className={headerCell}>Student</th>
            <th scope="col" className={`${headerCell} hidden sm:table-cell`}>University ID</th>
            <th scope="col" className={`${headerCell} hidden md:table-cell`}>RFID card</th>
            <th scope="col" className={`${headerCell} hidden lg:table-cell`}>Contact number</th>
            <th scope="col" className={`${headerCell} hidden sm:table-cell`}>Registered</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {query.isPending ? (
            <SkeletonRows />
          ) : (
            students.map((student) => (
              <tr
                key={student.studentId}
                // The name button is the keyboard target; the rest of the row is a bigger click target.
                onClick={() => onOpen(student)}
                className="cursor-pointer transition-colors hover:bg-canvas/70"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar student={student} />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpen(student);
                        }}
                        className="cursor-pointer rounded text-left font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frame"
                      >
                        {student.lastName}, {student.firstName}
                      </button>
                      <p className="text-xs text-ink-muted tabular-nums sm:hidden">{student.universityId}</p>
                      <p className="hidden truncate text-xs text-ink-muted sm:block">{student.universityEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 tabular-nums sm:table-cell">{student.universityId}</td>
                <td className="hidden px-4 py-3 font-mono text-xs tabular-nums md:table-cell">{student.rfidUid}</td>
                <td className="hidden px-4 py-3 tabular-nums lg:table-cell">
                  {student.contactNumber ?? <span className="text-ink-muted">—</span>}
                </td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-ink-muted sm:table-cell">{formatDate(student.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
