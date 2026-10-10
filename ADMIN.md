# Admin Use Cases

What an admin (registrar or security office staff) should be able to do across this dashboard (NU-SISi2) and the API (NUSIS-I2). The kiosk screen itself needs no login. Students only tap their cards.

The **API today** column reflects NUSIS-I2 at commit `fea1414` (2026-10-10):

- **Exists**: the endpoint is there; the dashboard still needs a screen for it.
- **Partial**: something is there, but not enough for the use case.
- **Missing**: needs API work (and usually a schema change).
- **Dashboard only**: no API change needed.

## 1. Sign-in and access

| ID | Use case | API today |
|----|----------|-----------|
| A1 | Sign in to the admin panel | Missing. There is no authentication; every endpoint is open to anyone on the network |
| A2 | Sign out, and lock an idle admin screen automatically | Missing |
| A3 | Show contact numbers and emergency contacts only to signed-in admins | Missing. `GET /api/students` returns them to anyone |

The `admin` table has no password column, so the sign-in method is still undecided (see [Open decisions](#open-decisions)). Note that its card column is spelled `refid_uid`.

## 2. Student records

| ID | Use case | API today |
|----|----------|-----------|
| S1 | Register a student: name, University ID, university email, RFID card, contact numbers, photo | Exists: `POST /api/students` (JSON, or multipart with a photo) |
| S2 | Fill the RFID field by tapping the card on the reader | Dashboard only. The reader types into whichever input has focus |
| S3 | Get a clear error when the card, University ID or email is already registered | Partial. The database rejects duplicates, but the API answers 500 with the raw database error instead of 409 naming the field |
| S4 | Open a student's profile: details, photo, today's status, attendance history | Partial. Lookup by card only (`GET /api/students/:rfid`), with today's logs only |
| S5 | Edit a student's details | Missing. There is no update endpoint |
| S6 | Replace a lost or damaged card, keeping the student's history | Missing (part of S5) |
| S7 | Deactivate a student (graduated, transferred, dropped) so their card stops working but their records stay | Missing. Needs a status column |
| S8 | Restore a deactivated student | Missing |
| S9 | Delete a student created by mistake | Missing. Deleting cascades to `daily_logs`, erasing attendance history. Use S7 for real students, and delete the photo from S3 too |

## 3. Photos

| ID | Use case | API today |
|----|----------|-----------|
| P1 | Upload a photo when registering | Exists: `profilePicture` field on `POST /api/students`. JPEG, PNG or WEBP, up to 2 MB, stored in S3 under `nusis/` |
| P2 | Replace a student's photo | Exists: `PUT /api/students/:studentId/profile-picture`. The old file is deleted from S3 |
| P3 | Remove a photo without replacing it | Missing |
| P4 | Take the photo with a webcam at the admin desk | Dashboard only. Uploads through P1 or P2 |
| P5 | Crop, rotate and shrink the photo before upload so it fits the ID frame and stays under 2 MB | Dashboard only. Phone photos are often over 2 MB and would otherwise be rejected |
| P6 | Bulk upload photos matched to students by file name (e.g. `2025-1131863.jpg`) | Missing |
| P7 | List students who have no photo yet | Missing (see F8) |

## 4. Search, sort and filter

| ID | Use case | API today |
|----|----------|-----------|
| F1 | Search by name: first or last, partial, case-insensitive | Missing. `GET /api/students` returns everyone and takes no parameters |
| F2 | Search by University ID, university email or RFID | Missing |
| F3 | Find a student by tapping their card at the admin desk | Exists: `GET /api/students/:rfid` |
| F4 | Sort alphabetically (A–Z or Z–A) by last or first name | Missing |
| F5 | Sort by University ID or by date registered | Missing |
| F6 | Filter by program, section or year level | Missing. These fields don't exist in the `students` table, which is also why the kiosk shows them as "—" |
| F7 | Filter by status: active or deactivated | Missing (depends on S7) |
| F8 | Filter by photo: has one, or missing | Missing |
| F9 | Filter by today's attendance: on campus now, timed out, not yet tapped | Missing |
| F10 | Combine search, filters and sorting, with pagination | Missing |

Searching and filtering should happen in the database, not in the browser, because the student list will reach thousands. One possible shape:

```
GET /api/students?search=villarin&program=BSIT&yearLevel=2&status=active&sort=lastName&order=asc&page=1&pageSize=25
→ { students: [...], total: 132 }
```

## 5. Attendance

| ID | Use case | API today |
|----|----------|-----------|
| L1 | See who is on campus right now (open logs today), updating live | Missing |
| L2 | Watch today's taps as they happen | Missing |
| L3 | View one student's attendance for a date range | Missing. Only today's logs are returned, inside S4 |
| L4 | View all logs for a date or date range, filtered by program or section | Missing |
| L5 | Record a Time In or Time Out for a student who forgot their card | Partial. `POST /api/daily-logs/tap` works with the student's card number, but only for the current moment |
| L6 | Correct a log: fix a wrong time, or close a forgotten Time Out | Missing |
| L7 | Delete a log recorded by mistake | Missing |
| L8 | Close logs that are still open at the end of the day | Missing |
| L9 | Export attendance to CSV or Excel for a date range or program | Missing |
| L10 | Attendance summaries: taps per day, peak hours, students absent for several days | Missing |

Manual records and corrections (L5–L8) should record which admin made them and why (see M4).

## 6. Bulk data

| ID | Use case | API today |
|----|----------|-----------|
| B1 | Import students from the registrar's CSV export | Partial. The table's columns already match that export, but `src/db/seed.ts` is a developer script, not an admin feature |
| B2 | Preview an import and fix row errors (duplicate card, bad email) before saving | Missing |
| B3 | Export the student list, respecting the current filters | Missing |
| B4 | Deactivate many students at once, e.g. a graduating batch | Missing (depends on S7) |
| B5 | Move everyone up a year level at the start of the school year | Missing (depends on F6) |

## 7. Admin accounts and accountability

| ID | Use case | API today |
|----|----------|-----------|
| M1 | Add an admin | Missing. The `admin` table exists, but `admin.provider.ts` is empty and there are no routes |
| M2 | Disable or remove an admin | Missing |
| M3 | Edit your own admin profile and photo | Missing |
| M4 | Audit trail: who created, edited or deleted which student or log, and when | Missing. Needs an audit table |
| M5 | Roles, e.g. view-only staff vs full admin | Missing (optional) |

The ERD still shows "ADMIN manages STUDENTS", but the `admin_id` foreign key on `students` was dropped (migration `20261009084132_drop_students_admin_id`). If it matters who registered a student, M4 covers it.

## 8. Kiosk oversight

| ID | Use case | API today |
|----|----------|-----------|
| K1 | Check that the API and database are up | Exists: `GET /health-checks` |
| K2 | See taps from unregistered cards, and register the student straight from that list | Missing. Taps that return 404 aren't stored |
| K3 | Change kiosk timings: how long a result stays on screen, and the repeat-tap window | Dashboard only. Currently constants in `src/hooks/useIdentification.js` |

## Suggested build order

1. **Sign-in (A1–A3).** Every other admin feature reads or changes student data, so it shouldn't ship on open endpoints.
2. **Edit, deactivate and card replacement (S3, S5–S7).**
3. **Search, sort and filter (F1–F5, F10)** with server-side query parameters. Then add program, section and year level (F6), which the kiosk is waiting on too.
4. **Photo tools (P3–P5).**
5. **Attendance views and corrections (L1–L7), then export (L9).**
6. **Bulk import and export (B1–B3) and the audit trail (M4).**

## Open decisions

- **How admins sign in:** university Google account, email and password, or admin card tap plus a PIN.
- **Where program, section and year level come from:** typed in by admins, imported from the registrar's CSV, or derived (e.g. year level from the University ID batch year, which goes wrong for irregular students).
- **Delete vs deactivate:** when a hard delete is allowed, and what happens to that student's logs and photo.
- **Unclosed logs:** leave them open, auto-close them at a set closing time, or flag them for review.
- **Where the admin panel lives:** an `/admin` section of this dashboard app, or a separate app.
