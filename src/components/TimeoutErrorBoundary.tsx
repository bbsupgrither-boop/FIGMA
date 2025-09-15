import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TimeoutErrorBoundary extends Component<Props, State> {
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Timeout Error Boundary caught an error:', error, errorInfo);
    
    // Автоматический сброс ошибки через 5 секунд
    this.timeoutId = setTimeout(() => {
      this.setState({ hasError: false, error: undefined });
    }, 5000);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full text-center p-6">
            <div className="unified-heading mb-4" style={{ color: '#ff3b30' }}>
              Ошибка загрузки
            </div>
            <div className="unified-text mb-4">
              Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 rounded-lg unified-button"
              style={{
                background: '#2B82FF',
                color: 'white',
                border: 'none',
                borderRadius: '12px'
              }}
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}