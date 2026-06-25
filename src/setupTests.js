// jest-dom adds custom jest matchers for asserting on DOM nodes.
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// jsdom does not implement these browser APIs that framer-motion and
// responsive code rely on. Provide inert mocks so components render in tests.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = MockObserver;
  global.IntersectionObserver = MockObserver;
}

if (!window.ResizeObserver) {
  window.ResizeObserver = MockObserver;
  global.ResizeObserver = MockObserver;
}
