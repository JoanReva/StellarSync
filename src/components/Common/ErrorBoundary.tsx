import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Memory Game:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-error-boundary-bg)] text-[var(--color-error-boundary-text)]">
          <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
          <button 
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2 transition-colors hover:bg-[var(--color-primary-hover)]"
            onClick={() => window.location.reload()}
          >
            Restart Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
