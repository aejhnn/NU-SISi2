import { useQuery } from "@tanstack/react-query";
import { fetchStudents, toIdentity } from "../api/students";

// The roster only changes when students register or update a photo, so a periodic refresh is
// enough. Cards registered in between still resolve, just through the slower per-card lookup.
const ROSTER_REFRESH_MS = 5 * 60_000;
// Until the first download succeeds every tap goes to the server, so keep retrying sooner.
const ROSTER_RETRY_MS = 30_000;

/**
 * Every registered student keyed by card serial, held in memory so a tap can be identified
 * without waiting on the server. Undefined until the first download completes.
 */
export function useStudentRoster() {
  const { data } = useQuery({
    queryKey: ["students"],
    queryFn: async ({ signal }) => {
      const students = await fetchStudents({ signal });
      // Keep only what the dashboard shows; contact details aren't held on the kiosk.
      return new Map(students.map((student) => [student.rfidUid, toIdentity(student)]));
    },
    staleTime: ROSTER_REFRESH_MS,
    refetchInterval: (query) => (query.state.data ? ROSTER_REFRESH_MS : ROSTER_RETRY_MS),
  });
  return data;
}
