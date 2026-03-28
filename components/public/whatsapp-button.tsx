"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ href }: { href?: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="group fixed bottom-[max(0.875rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-[max(0.75rem,env(safe-area-inset-right))] z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_44px_-24px_rgba(37,211,102,0.72)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] sm:right-[max(1.5rem,env(safe-area-inset-right))]"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-45 animate-[whatsapp-pulse_2.2s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <MessageCircle className="relative size-6 transition-transform duration-200 group-hover:scale-105" />
    </a>
  );
}
