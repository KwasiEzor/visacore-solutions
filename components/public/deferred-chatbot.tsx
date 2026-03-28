"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(
  () => import("@/components/public/chatbot").then((module) => module.Chatbot),
  { ssr: false }
);

export function DeferredChatbot() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const win = window;
    const activate = () => setEnabled(true);

    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(activate, { timeout: 1800 });
      return () => win.cancelIdleCallback(id);
    }

    const timeoutId = win.setTimeout(activate, 1200);
    return () => win.clearTimeout(timeoutId);
  }, []);

  return enabled ? <Chatbot /> : null;
}
