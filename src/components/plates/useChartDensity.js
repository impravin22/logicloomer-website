import { useEffect, useState } from "react";
import { useTheme } from "styled-components";

const matchesNow = (query) =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;

/**
 * Picks how much a chart shows from the width of the screen: "full" where a
 * card is wide enough for 13px technology lines and edge labels, "compact"
 * below that. Follows the window as it is resized.
 *
 * @returns {("compact"|"full")}
 */
export function useChartDensity() {
  const theme = useTheme();
  const query = `(min-width: ${theme.bp.chart})`;
  const [full, setFull] = useState(() => matchesNow(query));

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const list = window.matchMedia(query);
    const update = () => setFull(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return full ? "full" : "compact";
}

export default useChartDensity;
