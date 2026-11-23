import React from "react";
import { useTheme } from "styled-components";
import ErrorBoundary from "./ErrorBoundary";
import { useMotion } from "./motion";
import Threads from "./vendor/react-bits/Threads";

// How the threads are set: slow, and parting under the pointer.
const THREAD_SET = {
  lineCount: 64,
  amplitude: 1.5,
  distance: 0.35,
  thickness: 0.55,
  speed: 0.32,
  waves: 1.1,
  angle: -14,
  parting: 0.65,
  taper: 0.9,
  brightness: 1.25,
  fade: 0.35,
};
// A quiet field is fainter and does not answer the pointer.
const QUIET_OPACITY = 0.5;

/**
 * The page's moving threads, in the theme's own colours. They stop when the
 * reader pauses the page's motion, and a failure in the drawing costs only
 * the threads. Fills its parent, which sets where it sits.
 *
 * @param {{quiet: boolean}} props A quiet field is fainter and does not part
 *     under the pointer: for a second showing lower on the page.
 * @returns {React.ReactElement}
 */
const ThreadField = ({ quiet = false }) => {
  const theme = useTheme();
  const { paused } = useMotion();
  const still = paused || quiet;
  return (
    <ErrorBoundary fallback={null}>
      <Threads
        {...THREAD_SET}
        color={theme.ink}
        accentColor={theme.accent}
        opacity={quiet ? QUIET_OPACITY : 1}
        paused={paused}
        enableMouseInteraction={!still}
        parting={still ? 0 : THREAD_SET.parting}
      />
    </ErrorBoundary>
  );
};

export default ThreadField;
