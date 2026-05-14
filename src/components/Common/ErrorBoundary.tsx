import { Component, type ErrorInfo, type ReactNode } from 'react';
import { translate, useI18nStore } from '../../store/useI18nStore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Memory Game:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const language = useI18nStore.getState().language;

      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-error-boundary-bg)] text-[var(--color-error-boundary-text)]">
          <h1 className="mb-4 text-3xl font-bold">
            {translate(language, 'oopsError')}
          </h1>
          <button
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2 transition-colors hover:bg-[var(--color-primary-hover)]"
            onClick={() => window.location.reload()}
          >
            {translate(language, 'restartGame')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
