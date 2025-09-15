import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', {
      error,
      errorInfo,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full text-center p-6">
            <h2 className="unified-heading mb-4">Произошла ошибка в компоненте</h2>
            <p className="unified-text text-muted mb-4">{this.state.error?.message || 'Неизвестная ошибка'}</p>
            <details className="mb-4 text-left">
              <summary className="cursor-pointer unified-text font-medium">Детали ошибки</summary>
              <pre className="unified-text mt-2 p-2 bg-secondary rounded overflow-auto max-h-32">
                {this.state.error?.stack}
              </pre>
            </details>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="apple-button px-4 py-2"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}