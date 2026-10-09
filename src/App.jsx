import MainLayout from "./layout/MainLayout";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { sampleStudent } from "./data/sampleStudent";
import { useIdentification } from "./hooks/useIdentification";

function App() {
  const scan = useIdentification();
  const person = scan.identity ?? sampleStudent;
  // A new key replays the entrance animation each time a card is tapped.
  const revealKey = scan.identity ? `${person.studentId}@${person.timeIn.getTime()}` : "sample";

  return (
    <MainLayout title="Identification Preview">
      <Header role={person.role} busy={scan.status === "loading"} />
      <Dashboard
        person={person}
        watermark={scan.identity ? null : "Sample ID"}
        notice={scan.notice}
        revealKey={revealKey}
      />
    </MainLayout>
  );
}

export default App;
