
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        // Em produção: enviar para serviço de monitorização (Sentry, etc.)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Algo correu mal
                            </h1>
                            <p className="text-gray-500 mb-6">
                                Ocorreu um erro inesperado. Por favor, recarregue a página ou tente novamente mais tarde.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                Recarregar Página
                            </button>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <pre className="mt-6 text-left text-xs bg-gray-100 p-4 rounded-xl overflow-auto text-red-600">
                                    {this.state.error.message}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
