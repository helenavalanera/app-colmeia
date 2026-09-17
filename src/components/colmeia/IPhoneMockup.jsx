import React, { useEffect, useRef, useState } from "react";
import { Accessibility, AudioLines } from "lucide-react";
import IPhoneStatusBar from "./IPhoneStatusBar";

export default function IPhoneMockup({ children, className = "" }) {
  const pointer = useRef(null);
  const screen = useRef(null);
  const content = useRef(null);
  const closeButton = useRef(null);
  const trigger = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState(null);
  const [textScale, setTextScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  function movePointer(event) {
    if (event.pointerType === "touch" || !pointer.current) return;
    const screen = event.currentTarget;
    const rect = screen.getBoundingClientRect();
    pointer.current.style.transform = `translate(${event.clientX - rect.left - screen.clientLeft}px, ${event.clientY - rect.top - screen.clientTop}px)`;
    pointer.current.style.opacity = "1";
  }
  function hidePointer() {
    if (pointer.current) pointer.current.style.opacity = "0";
  }
  function stopSpeaking() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function toggleSpeech() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) { stopSpeaking(); return; }
    const utterance = new SpeechSynthesisUtterance(content.current?.innerText || "");
    utterance.lang = "pt-BR";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  }
  function startTriggerDrag(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: rect.left, originY: rect.top, moved: false };
    button.setPointerCapture?.(event.pointerId);
    window.addEventListener("pointermove", moveTriggerDrag);
    window.addEventListener("pointerup", endTriggerDrag);
    window.addEventListener("pointercancel", endTriggerDrag);
  }
  function moveTriggerDrag(event) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - active.startX, event.clientY - active.startY);
    if (!active.moved && distance < 5) return;
    active.moved = true;
    suppressClick.current = true;
    const viewport = screen.current.getBoundingClientRect();
    const button = trigger.current.getBoundingClientRect();
    const margin = Math.max(6, Math.min(12, viewport.width * .05));
    const x = Math.max(viewport.left + margin, Math.min(viewport.right - button.width - margin, active.originX + event.clientX - active.startX));
    const y = Math.max(viewport.top + margin, Math.min(viewport.bottom - button.height - margin, active.originY + event.clientY - active.startY));
    setTriggerPosition({ x: x - viewport.left, y: y - viewport.top });
  }
  function endTriggerDrag(event) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    trigger.current?.releasePointerCapture?.(event.pointerId);
    window.removeEventListener("pointermove", moveTriggerDrag);
    window.removeEventListener("pointerup", endTriggerDrag);
    window.removeEventListener("pointercancel", endTriggerDrag);
    drag.current = null;
    if (active.moved) requestAnimationFrame(() => { suppressClick.current = false; });
  }
  function activateTrigger(event) {
    if (suppressClick.current) { event.preventDefault(); return; }
    setDrawerOpen(true);
  }
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); closeDrawer(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...screen.current.querySelectorAll(".co-access-modal button, .co-access-modal [tabindex]:not([tabindex=\"-1\"])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    const frame = requestAnimationFrame(() => closeButton.current?.focus());
    return () => { document.removeEventListener("keydown", handleKeyDown); cancelAnimationFrame(frame); };
  }, [drawerOpen]);
  useEffect(() => () => stopSpeaking(), []);
  return (
    <div className={`co-iphone-mockup ${className}`.trim()}>
      <span className="co-iphone-button co-iphone-action" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-volume-up" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-volume-down" aria-hidden="true" />
      <span className="co-iphone-button co-iphone-power" aria-hidden="true" />

      <div className="co-iphone-frame">
        <div ref={screen} className={`co-iphone-screen${highContrast ? " co-access-high-contrast" : ""}${reducedMotion ? " co-access-reduced-motion" : ""}`} style={{ "--co-access-text-scale": textScale / 100 }} onPointerMove={(event) => { movePointer(event); moveTriggerDrag(event); }} onPointerLeave={hidePointer} onPointerDown={() => pointer.current?.classList.add("is-pressed")} onPointerUp={(event) => { pointer.current?.classList.remove("is-pressed"); endTriggerDrag(event); }}>
          <span ref={pointer} className="co-touch-pointer" aria-hidden="true"><span /></span>
          <IPhoneStatusBar />
          <div className="co-dynamic-island" aria-hidden="true">
            <span className="co-dynamic-camera" />
            <span className="co-dynamic-sensor" />
          </div>
          <div ref={content} className="co-iphone-content"><div className="co-iphone-viewport">{children}</div></div>
          <button ref={trigger} type="button" className={`co-access-trigger${triggerPosition ? " is-positioned" : ""}`} style={triggerPosition ? { left: triggerPosition.x, top: triggerPosition.y } : undefined} aria-label="Abrir opções de acessibilidade" aria-controls="co-access-modal" aria-expanded={drawerOpen} onClick={activateTrigger} onPointerDown={startTriggerDrag} onPointerMove={moveTriggerDrag} onPointerUp={endTriggerDrag} onPointerCancel={endTriggerDrag}><Accessibility size={21} aria-hidden="true" /></button>
          {drawerOpen && <button type="button" className="co-access-backdrop" aria-label="Fechar acessibilidade" onClick={closeDrawer} />}
          <aside id="co-access-modal" className={`co-access-modal${drawerOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Acessibilidade" aria-hidden={!drawerOpen} inert={drawerOpen ? undefined : ""}>
            <div className="co-access-heading"><h2>Acessibilidade</h2><button ref={closeButton} type="button" className="co-access-close" aria-label="Fechar opções de acessibilidade" onClick={closeDrawer}>×</button></div>
            <div className="co-access-group co-access-speech-group"><button type="button" className="co-access-speech" onClick={toggleSpeech} disabled={typeof window !== "undefined" && !window.speechSynthesis}><AudioLines size={16} aria-hidden="true" />{speaking ? "Parar leitura" : "Ouvir conteúdo"}</button></div>
            <div className="co-access-row"><span className="co-access-label">Alto contraste</span><button type="button" role="switch" className="co-access-switch" aria-checked={highContrast} onClick={() => setHighContrast((value) => !value)}><span aria-hidden="true" />{highContrast ? "Ligado" : "Desligado"}</button></div>
            <fieldset className="co-access-group co-access-range-group"><div className="co-access-range-heading"><legend>Tamanho do texto</legend><output htmlFor="co-access-text-scale">{textScale}%</output></div><div className="co-access-range-line"><span aria-hidden="true">A−</span><input id="co-access-text-scale" type="range" min="85" max="130" step="5" value={textScale} aria-label="Tamanho do texto" aria-valuemin="85" aria-valuemax="130" aria-valuenow={textScale} aria-valuetext={`${textScale} por cento`} onChange={(event) => setTextScale(Number(event.target.value))} /><span aria-hidden="true">A+</span></div></fieldset>
            <div className="co-access-row"><span className="co-access-label">Reduzir estímulos</span><button type="button" role="switch" className="co-access-switch" aria-checked={reducedMotion} onClick={() => setReducedMotion((value) => !value)}><span aria-hidden="true" />{reducedMotion ? "Ligado" : "Desligado"}</button></div>
          </aside>
          <span className="co-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
