import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStudents } from "../api/students";
import { createStudent, fetchHealth, fetchStudent, replacePhoto } from "./api";

const HEALTH_CHECK_MS = 30_000;

// Everything the admin pages cache sits under "admin", so one invalidation refreshes it all.
const keys = {
  all: ["admin"],
  students: ["admin", "students"],
  student: (rfid) => ["admin", "student", rfid],
  health: ["admin", "health"],
};

export const useStudents = () =>
  useQuery({ queryKey: keys.students, queryFn: ({ signal }) => fetchStudents({ signal }) });

/** One student with today's logs. */
export const useStudent = (rfid) =>
  useQuery({
    queryKey: keys.student(rfid),
    queryFn: ({ signal }) => fetchStudent(rfid, { signal }),
    enabled: Boolean(rfid),
  });

export const useApiHealth = () =>
  useQuery({
    queryKey: keys.health,
    queryFn: ({ signal }) => fetchHealth({ signal }),
    refetchInterval: HEALTH_CHECK_MS,
    retry: false,
  });

// Mutations put the API's answer straight into the cached list, so the screen updates (and a new
// student's profile can open) right away, then refetch everything to pick up other changes.
const updateList = (queryClient, update) => {
  queryClient.setQueryData(keys.students, (students) => students && update(students));
  return queryClient.invalidateQueries({ queryKey: keys.all });
};

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ values, photo }) => createStudent(values, photo),
    onSuccess: (created) => updateList(queryClient, (students) => [...students, created]),
  });
}

export function useReplacePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, photo }) => replacePhoto(studentId, photo),
    onSuccess: (updated) =>
      updateList(queryClient, (students) =>
        students.map((student) => (student.studentId === updated.studentId ? updated : student)),
      ),
  });
}
