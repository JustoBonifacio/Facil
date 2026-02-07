
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { actions, state } = useApp();
    const [isLogin, setIsLogin] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
    const [error, setError] = useState<string | null>(null);

    // Extra Owner Fields
    const [phone, setPhone] = useState('');
    const [nif, setNif] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');

    const from = (location.state as any)?.from?.pathname || '/';

    // Redirect if already logged in
    React.useEffect(() => {
        if (state.user) {
            navigate(from, { replace: true });
        }
    }, [state.user, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isLogin) {
                await actions.login(email, password);
                navigate(from, { replace: true });
            } else {
                await actions.register(name, email, password, role, {
                    phone,
                    nif,
                    companyName,
                    address
                });
                // After register, switch to login or show success
                setIsLogin(true);
                setError('Registo concluído! Por favor verifique o seu email.');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-gray-50">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl border border-gray-100 animate-scale-in">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-blue-700 mb-2">FACIL</h1>
                        <p className="text-sm text-gray-500 uppercase tracking-[0.3em] font-bold">
                            {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg text-center font-medium border border-blue-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="Seu nome"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                placeholder="********"
                            />
                        </div>

                        {!isLogin && (
                            <div className="animate-fade-in space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Eu sou...</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole(UserRole.CLIENT)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${role === UserRole.CLIENT
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            Cliente
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole(UserRole.OWNER)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${role === UserRole.OWNER
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            Proprietário
                                        </button>
                                    </div>
                                </div>

                                {role === UserRole.OWNER && (
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4 animate-fade-in-up">
                                        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide">Dados Profissionais</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                                placeholder="+244 9XX XXX XXX"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">NIF (Opcional)</label>
                                            <input
                                                type="text"
                                                value={nif}
                                                onChange={(e) => setNif(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                                placeholder="Número de Identificação Fiscal"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa / Agência (Opcional)</label>
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                                placeholder="Ex: Imobiliária Silva"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço do Escritório (Opcional)</label>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                                placeholder="Cidade, Bairro, Rua..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        <button
                            type="submit"
                            disabled={state.isLoading}
                            className="w-full py-4 text-white font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50 mt-6"
                        >
                            {state.isLoading ? 'A processar...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
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
