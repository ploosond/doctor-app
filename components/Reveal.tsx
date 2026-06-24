"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** seconds to delay the entrance */
  delay?: number;
  /** rise distance in px (default 56) */
  y?: number;
};

// Scroll-reveal: fade + rise + slight scale once when the block enters the viewport.
// Honors prefers-reduced-motion (renders children with no animation).
export function Reveal({ children, delay = 0, y = 56 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
