"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="mb-2 text-3xl">⚠️</p>
            <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Something went wrong
            </h3>
            <p className="mb-4 text-sm text-zinc-500">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
