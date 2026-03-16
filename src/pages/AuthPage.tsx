
import React from 'react';
import { useAuthForm } from '../features/auth/hooks/useAuthForm';
import { UserRole } from '../shared/types';
import { ShieldCheck, Mail, Lock, User as UserIcon, Phone, Briefcase, MapPin, ArrowRight, Home } from 'lucide-react';

const AuthPage: React.FC = () => {
    const {
        isLogin, setIsLogin,
        name, setName,
        email, setEmail,
        password, setPassword,
        role, setRole,
        error, setError,
        phone, setPhone,
        companyName, setCompanyName,
        address, setAddress,
        handleSubmit,
        isLoading
    } = useAuthForm();

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-[#f8fafc] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse duration-700"></div>

            <div className="max-w-xl w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-2xl p-12 md:p-16 rounded-xl shadow-2xl border border-white/50 animate-in zoom-in-95 duration-500">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-facil-blue text-white p-5 rounded-xl shadow-2xl shadow-facil-blue/20 mb-6 group hover:rotate-12 transition-transform animate-icon-bounce">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Fácil</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                            {isLogin ? 'Autenticação Segura de Angola' : 'Junte-se ao Futuro Imobiliário'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 text-rose-800 text-sm rounded-xl font-bold border border-rose-100 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-4">Nome Completo</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50/50 rounded-xl border-2 border-transparent focus:border-facil-blue focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300"
                                        placeholder="Seu nome"
                                    />
                                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                </div>
                            </div>
                        )}

                        <div className="animate-in slide-in-from-right-4 duration-500">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Endereço de E-mail</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 rounded-xl border-2 border-transparent focus:border-facil-blue focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300"
                                    placeholder="exemplo@facil.ao"
                                />
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            </div>
                        </div>

                        <div className="animate-in slide-in-from-right-4 duration-700">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Palavra-passe</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 rounded-xl border-2 border-transparent focus:border-facil-blue focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4">Eu pretendo...</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setRole(UserRole.CLIENT)}
                                            className={`p-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-2 ${role === UserRole.CLIENT
                                                ? 'border-facil-blue bg-facil-blue text-white shadow-xl shadow-facil-blue/20'
                                                : 'border-slate-100 text-slate-400 hover:border-facil-blue/30'
                                                }`}
                                        >
                                            <Mail className="w-5 h-5" />
                                            Comprar / Alugar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole(UserRole.OWNER)}
                                            className={`p-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-2 ${role === UserRole.OWNER
                                                ? 'border-facil-blue bg-facil-blue text-white shadow-xl shadow-facil-blue/20'
                                                : 'border-slate-100 text-slate-400 hover:border-facil-blue/30'
                                                }`}
                                        >
                                            <Home className="w-5 h-5" />
                                            Anunciar Imóvel
                                        </button>
                                    </div>
                                </div>

                                {role === UserRole.OWNER && (
                                    <div className="space-y-6 bg-slate-50/50 p-8 rounded-xl border border-slate-100 animate-in zoom-in-95">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-1 w-8 bg-facil-blue rounded-full"></div>
                                            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">Perfil Profissional</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    required
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-4 bg-white rounded-xl border-2 border-transparent focus:border-facil-blue outline-none transition-all font-bold placeholder:text-slate-300"
                                                    placeholder="WhatsApp / Telefone"
                                                />
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-facil-blue w-4 h-4" />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-4 bg-white rounded-xl border-2 border-transparent focus:border-facil-blue outline-none transition-all font-bold placeholder:text-slate-300"
                                                    placeholder="Empresa / Imobiliária"
                                                />
                                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-facil-blue w-4 h-4" />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className="w-full pl-14 pr-6 py-4 bg-white rounded-xl border-2 border-transparent focus:border-facil-blue outline-none transition-all font-bold placeholder:text-slate-300"
                                                    placeholder="Endereço Profissional"
                                                />
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-facil-blue w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 text-white font-black uppercase tracking-widest text-[10px] rounded-xl bg-gradient-to-r from-facil-blue to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all shadow-2xl shadow-facil-blue/20 group relative overflow-hidden active:scale-[0.98] disabled:opacity-50 mt-10"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? 'Autenticando...' : (isLogin ? 'Entrar no Sistema' : 'Criar Perfil de Elite')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform skew-x-12 duration-500"></div>
                        </button>
                    </form>

                    <div className="text-center mt-12 pt-8 border-t border-gray-100">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                        >
                            {isLogin ? 'Ainda não é parceiro? Registe-se' : 'Já é nosso parceiro? Aceder'}
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-12 px-8 uppercase tracking-[0.2em] font-black opacity-50">
                    FACIL ANGOLA · PLATAFORMA DE CONFIANÇA · <a href="#" className="hover:text-blue-600 transition underline underline-offset-4 decoration-2">TERMOS & PRIVACIDADE</a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
