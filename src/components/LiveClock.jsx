import { useEffect, useState } from "react";
import { formatClock } from "../lib/format";

// Re-arms on each second boundary instead of a fixed interval, so the display never lags the system clock.
function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = setTimeout(tick, 1000 - date.getMilliseconds());
    };
    timer = setTimeout(tick, 1000 - new Date().getMilliseconds());
    return () => clearTimeout(timer);
  }, []);

  return now;
}

function LiveClock({ className }) {
  const now = useNow();
  return (
    <time dateTime={now.toISOString()} className={className}>
      {formatClock(now)}
    </time>
  );
}

export default LiveClock;
