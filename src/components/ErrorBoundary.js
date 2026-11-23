import React from "react";

/**
 * Keeps one section's failure from blanking the page. The error is logged for
 * the developer; the reader sees `fallback`, a written message, never the error.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error("A section failed to render", error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default ErrorBoundary;
