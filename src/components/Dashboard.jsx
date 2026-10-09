import { useState, useEffect } from "react";

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* Body */}
      <section>
        <div id="idcontainer">
          {/* <img src="/student.png" alt="Student" width="120" /> */}
        </div>
        <h2>Juan Dela Cruz</h2>{/* replace with a variable */}
        <p>Student ID: 2026-00001</p> {/* replace with a variable */}
        <p>Program & Section: BSIT - 2A</p> {/* replace with a variable */}
        <p>Year Level: 2nd Year</p> {/* replace with a variable */}
      </section>

      {/* Footer */}
      <footer>
        <p>Time-in: 8:00 AM</p> {/* replace with a variable */}
        <p>Time-out: 5:00 PM</p> {/* replace with a variable */}
        <p>Current Time: {currentTime}</p>
      </footer>
    </main>
  );
}

export default Dashboard;