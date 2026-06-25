import { render, screen } from "@testing-library/react";
import App from "./App";

test("mounts the portfolio with the architect's name as the page h1", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 1, name: /praveen kumar chittem/i })
  ).toBeInTheDocument();
});

test("exposes the primary content sections as labelled landmarks", () => {
  render(<App />);
  expect(screen.getAllByRole("region").length).toBeGreaterThanOrEqual(6);
});
