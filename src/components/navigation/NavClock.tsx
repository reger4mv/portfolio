"use client";

import { useEffect, useState } from "react";

/** Local time in Kathmandu — rendered after mount to avoid a mismatch. */
export function NavClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kathmandu",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setTime("");
      }
    };
    format();
    const id = window.setInterval(format, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="nav__clock" aria-hidden="true">
      KTM <b suppressHydrationWarning>{time || "--:--"}</b>
    </span>
  );
}
