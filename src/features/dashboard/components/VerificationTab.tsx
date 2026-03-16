
import React from 'react';
import { BadgeCheck, Mail, CreditCard, FileText, ScanFace, Smartphone, Check, Clock, Camera, ShieldCheck, AlertTriangle } from 'lucide-react';
import { User, UserDocument } from '../../../shared/types';

interface VerificationTabProps {
    user: User;
    documents: UserDocument[];
    onUploadVerify: (type: 'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS') => void;
    onStartFaceScan: () => void;
}

export const VerificationTab: React.FC<VerificationTabProps> = ({
    user,
    documents,
    onUploadVerify,
    onStartFaceScan
}) => {
    const hasDoc = (type: string) => documents.some(d => d.type === type);

    return (
        <div className="animate-fade-in space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Centro de Verificação <BadgeCheck className="w-10 h-10 text-facil-blue animate-icon-pulse" />
                    </h2>
                    <p className="text-slate-500 font-medium mt-2">Aumente a sua credibilidade em 85% com uma conta verificada.</p>
                </div>
                <div className="px-6 py-3 bg-blue-50 rounded-xl flex items-center gap-3 border border-blue-100">
                    <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-facil-blue w-[80%] rounded-full shadow-sm"></div>
                    </div>
                    <span className="text-facil-blue font-black text-[10px] uppercase tracking-widest">80% Completo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
                        <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Etapas de Confiança</h3>

                        {/* Step 1: Email */}
                        <div className="flex items-center justify-between p-6 bg-emerald-50/20 rounded-xl border border-emerald-100">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 animate-icon-pulse">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">E-mail Confirmado</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                <Check className="w-5 h-5" /> Verificado
                            </div>
                        </div>

                        {/* Step 2: Identity */}
                        <div className="flex items-center justify-between p-6 bg-blue-50/20 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-facil-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-facil-blue/20">
                                    <CreditCard className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">Identidade (BI)</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed max-w-[200px]">
                                        {hasDoc('ID_CARD') ? 'Documento enviado e em análise' : 'Submeta o seu BI ou Passaporte'}
                                    </p>
                                </div>
                            </div>
                            {hasDoc('ID_CARD') ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-facil-blue font-black text-[10px] uppercase tracking-widest">
                                        <Clock className="w-5 h-5" /> Em Análise
                                    </div>
                                    <button
                                        onClick={() => onUploadVerify('ID_CARD')}
                                        className="px-4 py-2 bg-white border border-blue-200 text-facil-blue rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
                                    >
                                        Editar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onUploadVerify('ID_CARD')}
                                    className="px-6 py-3 bg-facil-blue text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-facil-blue/20"
                                >
                                    Submeter
                                </button>
                            )}
                        </div>

                        {/* Step 3: NIF */}
                        <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-facil-blue transition-all">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-facil-blue group-hover:text-white transition-all">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">Cartão de Contribuinte (NIF)</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                        {hasDoc('TAX_ID') ? 'Documento enviado' : 'Opcional, mas recomendado'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUploadVerify('TAX_ID')}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-facil-blue hover:text-facil-blue transition-all"
                            >
                                {hasDoc('TAX_ID') ? 'Editar' : 'Verificar'}
                            </button>
                        </div>

                        {/* Step 4: Face Scan */}
                        <div className="flex items-center justify-between p-6 bg-indigo-50/20 rounded-xl border border-indigo-100 group hover:border-indigo-600 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 animate-icon-pulse">
                                    <ScanFace className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">Reconhecimento Facial</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed max-w-[200px]">Verificação de prova de vida em tempo real</p>
                                </div>
                            </div>
                            <button
                                onClick={onStartFaceScan}
                                className="px-6 py-3 bg-white border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2"
                            >
                                <Camera className="w-4 h-4" /> Iniciar Scan
                            </button>
                        </div>

                        {/* Step 5: Phone */}
                        <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-facil-blue transition-all cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-facil-blue group-hover:text-white transition-all shadow-lg shadow-transparent group-hover:shadow-facil-blue/20">
                                    <Smartphone className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">Telemóvel</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Não verificado</p>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-facil-blue hover:text-facil-blue transition-all">
                                Verificar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-facil-blue p-8 rounded-xl text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="w-32 h-32" />
                        </div>
                        <h4 className="text-xl font-black mb-4 relative z-10 text-[10px] uppercase tracking-[0.2em]">Porquê ser verificado?</h4>
                        <ul className="space-y-4 relative z-10">
                            <li className="flex gap-3 text-[12px] font-bold text-blue-100 items-center">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                Acesso a Imóveis Premium exclusivos
                            </li>
                            <li className="flex gap-3 text-[12px] font-bold text-blue-100 items-center">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                Destaque nos resultados de pesquisa
                            </li>
                            <li className="flex gap-3 text-[12px] font-bold text-blue-100 items-center">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                Selos de Confiança no seu perfil
                            </li>
                            <li className="flex gap-3 text-[12px] font-bold text-blue-100 items-center">
                                <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                Suporte Prioritário 24/7
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3 text-amber-800 mb-3">
                            <AlertTriangle className="w-6 h-6 animate-icon-bounce" />
                            <h4 className="font-black text-[10px] uppercase tracking-widest">Atenção</h4>
                        </div>
                        <p className="text-amber-700 text-[13px] font-medium leading-relaxed">
                            Os seus dados estão protegidos por criptografia de ponta a ponta e nunca serão partilhados com terceiros sem o seu consentimento.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
