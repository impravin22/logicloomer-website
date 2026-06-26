import { createContext } from "react";

// Shared so both Main (provider) and Navigation (consumer) import the same
// context object without a circular Main <-> Navigation dependency.
export const ThemeToggleContext = createContext({
  isDark: true,
  toggleTheme: () => {},
});
