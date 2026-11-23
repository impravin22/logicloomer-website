import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

// Whether the reader has asked their system for less motion, read once.
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MotionContext = createContext(null);

/**
 * Holds one answer for the whole page to "is the background motion paused?",
 * so the one control in the hero stops every moving background at once. For a
 * reader who has asked their system for less motion the backgrounds hold
 * still and there is nothing to control.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {React.ReactElement}
 */
export const MotionProvider = ({ children }) => {
  const [reduced] = useState(prefersReducedMotion);
  const [paused, setPaused] = useState(false);
  const toggle = useCallback(() => setPaused((was) => !was), []);
  const value = useMemo(
    () => (reduced ? { paused: true, toggle: null } : { paused, toggle }),
    [reduced, paused, toggle]
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};

/**
 * The page's background motion: whether it is paused, and how to flip that.
 * `toggle` is null where there is nothing to flip: for a reader who has asked
 * for less motion, and for a component drawn outside a MotionProvider, whose
 * background follows that setting alone.
 *
 * @returns {{paused: boolean, toggle: ?function(): void}}
 */
export const useMotion = () => {
  const shared = useContext(MotionContext);
  const [reduced] = useState(prefersReducedMotion);
  return shared || { paused: reduced, toggle: null };
};
