"use client";

import { useEffect, useRef } from "react";
import {
  BRAND,
  CONNECTORS,
  CONNECTORS_MOBILE,
  SECTIONS,
} from "./world-config";

declare global {
  interface Window {
    mountScrollWorld?: (container: HTMLElement, config: unknown) => void;
  }
}

const ENGINE_SRC = "/scroll-world-engine.js";

// The engine drives everything off window scroll, so the two ends of its track are
// just the document bounds — no need to reach into its segment table.
const jump = (end: 0 | 1) =>
  window.scrollTo({
    top: end * (document.documentElement.scrollHeight - window.innerHeight),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // StrictMode runs effects twice in dev; the engine builds its own DOM, so
    // guard against a second mount rather than tearing the first one down.
    const mount = () => {
      if (mountedRef.current || !window.mountScrollWorld) return;
      mountedRef.current = true;
      window.mountScrollWorld(container, {
        brand: BRAND,
        sections: SECTIONS,
        connectors: CONNECTORS,
        connectorsMobile: CONNECTORS_MOBILE,
        diveScroll: 1.4,
        connScroll: 0.9,
        hint: "꽉 잡으세요! 스크롤 하면 날아갑니다.",
        nav: true,
        atmosphere: true,
      });

      // The engine sizes its scroll track from window.innerHeight at mount. If the
      // container is laid out before the viewport has a height (hidden tab, offscreen
      // pane), the track comes out 0px tall and the page cannot scroll at all. One
      // resize on the next frame re-runs its layout with real numbers; it is idempotent.
      requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    };

    if (window.mountScrollWorld) {
      mount();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${ENGINE_SRC}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = ENGINE_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", mount);
    return () => script?.removeEventListener("load", mount);
  }, []);

  return (
    <>
      <div id="world" ref={containerRef} />
      <nav className="sw-jump" aria-label="페이지 이동">
        <button type="button" aria-label="맨 위로" onClick={() => jump(0)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 3.5h8" />
            <path d="M8 12.8V6.4" />
            <path d="M5.2 9.2 8 6.2l2.8 3" />
          </svg>
        </button>
        <button type="button" aria-label="맨 아래로" onClick={() => jump(1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 3.2v6.4" />
            <path d="M5.2 6.8 8 9.8l2.8-3" />
            <path d="M4 12.5h8" />
          </svg>
        </button>
      </nav>
    </>
  );
}
