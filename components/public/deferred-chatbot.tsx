"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chatbot = dynamic(
  () => import("@/components/public/chatbot").then((module) => module.Chatbot),
  { ssr: false }
);

interface DeferredChatbotProps {
  title: string;
  launcherLabel: string;
  welcomeMessage: string;
  inputPlaceholder: string;
}

export function DeferredChatbot({
  title,
  launcherLabel,
  welcomeMessage,
  inputPlaceholder,
}: DeferredChatbotProps) {
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

  return enabled ? (
    <Chatbot
      title={title}
      launcherLabel={launcherLabel}
      welcomeMessage={welcomeMessage}
      inputPlaceholder={inputPlaceholder}
    />
  ) : null;
}
