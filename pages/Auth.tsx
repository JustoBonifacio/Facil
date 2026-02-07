
import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthProps {
    onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-blue-700">FACIL</h2>
                    <p className="mt-2 text-sm text-gray-600 uppercase tracking-widest font-bold">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie a sua conta'}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => onLogin(UserRole.CLIENT)}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-blue-200"
                    >
                        Entrar como Comprador/Arrendatário
                    </button>

                    <button
                        onClick={() => onLogin(UserRole.OWNER)}
                        className="group relative w-full flex justify-center py-4 px-4 border-2 border-blue-600 text-sm font-bold rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-all"
                    >
                        Entrar como Proprietário
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-400">Administração</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onLogin(UserRole.ADMIN)}
                        className="w-full flex justify-center py-3 px-4 text-xs font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest"
                    >
                        Acesso Administrativo
                    </button>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                        {isLogin ? 'Ainda não tem conta? Registe-se' : 'Já tem conta? Inicie sessão'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
