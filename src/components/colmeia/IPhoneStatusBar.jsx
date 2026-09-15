import React, { useEffect, useState } from "react";

function currentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function IPhoneStatusBar() {
  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(currentTime()), 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="co-iphone-status" aria-label={`Horário ${time}. Sinal disponível, Wi-Fi conectado e bateria em 85%.`}>
      <time dateTime={time}>{time}</time>
      <span className="co-status-island-space" aria-hidden="true" />
      <span className="co-status-icons" aria-hidden="true">
        <svg className="co-status-signal" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="14" width="3" height="8" rx="1" />
          <rect x="7" y="10" width="3" height="12" rx="1" />
          <rect x="12" y="6" width="3" height="16" rx="1" />
          <rect x="17" y="2" width="3" height="20" rx="1" opacity=".32" />
        </svg>
        <svg className="co-status-wifi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 20h.01" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M5 13a10 10 0 0 1 14 0" />
        </svg>
        <span className="co-status-battery">
          <span className="co-status-battery-fill" />
          <span className="co-status-battery-level">85</span>
        </span>
      </span>
    </div>
  );
}
