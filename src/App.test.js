import { render, screen } from "@testing-library/react";
import App from "./App";

test("mounts the portfolio with Pravy as the page h1", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 1, name: /pravy/i })
  ).toBeInTheDocument();
});

test("exposes the content sections as labelled landmarks", () => {
  render(<App />);
  expect(screen.getAllByRole("region").length).toBeGreaterThanOrEqual(4);
});
