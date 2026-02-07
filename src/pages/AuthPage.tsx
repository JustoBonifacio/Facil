
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { actions, state } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/';

    // Redirect if already logged in
    React.useEffect(() => {
        if (state.user) {
            navigate(from, { replace: true });
        }
    }, [state.user, navigate, from]);

    const handleLogin = async (role: UserRole) => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        actions.login(role);

        // Navigate based on role
        if (role === UserRole.ADMIN) {
            navigate('/admin');
        } else {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-gray-50">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-gray-100 animate-scale-in">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-blue-700 mb-2">FACIL</h1>
                        <p className="text-sm text-gray-500 uppercase tracking-[0.3em] font-bold">
                            {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
                        </p>
                    </div>

                    {/* Demo Login Buttons */}
                    <div className="space-y-4">
                        <p className="text-center text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">
                            Demonstração - Escolha um perfil
                        </p>

                        <button
                            onClick={() => handleLogin(UserRole.CLIENT)}
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 px-4 text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
                        >
                            <span className="mr-2">👤</span>
                            Entrar como Comprador/Arrendatário
                        </button>

                        <button
                            onClick={() => handleLogin(UserRole.OWNER)}
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 px-4 border-2 border-blue-600 text-sm font-bold rounded-2xl text-blue-600 bg-white hover:bg-blue-50 transition-all disabled:opacity-50"
                        >
                            <span className="mr-2">🏠</span>
                            Entrar como Proprietário
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400 font-medium">Administração</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleLogin(UserRole.ADMIN)}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 text-xs font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest transition disabled:opacity-50"
                        >
                            <span className="mr-2">⚙️</span>
                            Acesso Administrativo
                        </button>
                    </div>

                    {/* Toggle */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            {isLogin ? 'Ainda não tem conta? Registe-se' : 'Já tem conta? Inicie sessão'}
                        </button>
                    </div>
                </div>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-400 mt-6 px-4">
                    Ao continuar, concorda com os nossos <a href="#" className="underline">Termos de Serviço</a> e <a href="#" className="underline">Política de Privacidade</a>.
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
