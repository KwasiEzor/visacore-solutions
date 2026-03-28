"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ href }: { href?: string }) {
  if (!href) {
    return null;
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      className="fixed bottom-[max(0.875rem,calc(env(safe-area-inset-bottom)+0.5rem))] right-[max(0.75rem,env(safe-area-inset-right))] z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_44px_-24px_rgba(37,211,102,0.72)] transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] sm:right-[max(1.5rem,env(safe-area-inset-right))]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />
      <MessageCircle className="relative size-6" />
    </motion.a>
  );
}
