import React from "react";
import IPhoneStatusBar from "./IPhoneStatusBar";

export default function IPhoneMockup({ children, className = "" }) {
  return (
    <div className={`co-iphone-mockup ${className}`.trim()}>
      <span className="co-iphone-button co-iphone-action" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-volume-up" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-volume-down" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-power" aria-hidden="true" />

      <div className="co-iphone-frame">
        <div className="co-iphone-screen">
          <IPhoneStatusBar />
          <div className="co-dynamic-island" aria-hidden="true">
            <span className="co-dynamic-camera" />
            <span className="co-dynamic-sensor" />
          </div>
          <div className="co-iphone-content"><div className="co-iphone-viewport">{children}</div></div>
          <span className="co-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
