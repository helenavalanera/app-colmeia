import React from "react";

export default function IPhoneMockup({ children, className = "" }) {
  return (
    <div className={`co-iphone-mockup ${className}`.trim()}>
      <span className="co-iphone-button co-iphone-action" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-volume-up" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-volume-down" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-power" aria-hidden="true" />

      <div className="co-iphone-frame">
        <div className="co-iphone-screen">
          <div className="co-dynamic-island" aria-hidden="true">
            <span className="co-dynamic-camera" />
            <span className="co-dynamic-sensor" />
          </div>
          <div className="co-iphone-content">{children}</div>
          <span className="co-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
