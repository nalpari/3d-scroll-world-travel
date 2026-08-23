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

  return <div id="world" ref={containerRef} />;
}
