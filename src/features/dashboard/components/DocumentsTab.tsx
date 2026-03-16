
import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { UserDocument } from '../../../shared/types';

interface DocumentsTabProps {
    documents: UserDocument[];
    onUploadClick: () => void;
    onViewDocument: (url: string) => void;
    onActivateSignature: () => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
    documents,
    onUploadClick,
    onViewDocument,
    onActivateSignature
}) => {
    return (
        <div className="animate-fade-in">
            <div className="bg-white p-10 md:p-12 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Cofre Digital</h2>
                        <p className="text-slate-500 font-bold text-lg mt-2">Segurança máxima para os seus documentos de identificação.</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-8 py-4 rounded-xl font-black flex items-center gap-3 border border-emerald-100 shadow-sm transition-all hover:shadow-md cursor-default group">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                        VERIFICAÇÃO COMPLETA
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {documents.map(doc => (
                        <div key={doc.id} className="p-8 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                            <div className="text-facil-blue mb-6 transform group-hover:scale-110 transition duration-500 animate-icon-pulse">
                                {doc.type === 'ID_CARD' ? <ShieldCheck className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                            </div>
                            <h4 className="font-black text-slate-900 mb-2 text-xl">
                                {doc.type === 'ID_CARD' ? 'Bilhete de Identidade' :
                                    doc.type === 'TAX_ID' ? 'NIF / Contribuinte' :
                                        doc.type === 'PROOF_ADDRESS' ? 'Prova de Residência' : 'Documento Extra'}
                            </h4>
                            <div className="flex items-center gap-2 mb-8">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg tracking-widest ${doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' :
                                    doc.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                    {doc.status}
                                </span>
                            </div>
                            <button
                                onClick={() => onViewDocument(doc.url)}
                                className="w-full py-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-sm text-slate-600 hover:border-facil-blue hover:text-facil-blue transition-all"
                            >
                                Visualizar
                            </button>
                        </div>
                    ))}

                    <div
                        onClick={onUploadClick}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center gap-6 hover:border-facil-blue hover:bg-facil-blue/5 transition-all cursor-pointer group"
                    >
                        <div className="h-16 w-16 bg-facil-blue text-white rounded-xl flex items-center justify-center text-3xl shadow-lg shadow-facil-blue/20 group-hover:rotate-90 transition duration-500 translate-y-0 group-hover:-translate-y-2">
                            +
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-800 text-xl">Novo Ficheiro</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Até 10MB · PDF/PNG</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-gradient-to-br from-facil-blue to-indigo-900 rounded-xl p-12 text-white flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group/card">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover/card:scale-125 transition-transform duration-1000"></div>
                    <div className="text-white/20 p-6 bg-white/10 rounded-xl backdrop-blur-md animate-icon-bounce">
                        <ShieldCheck className="w-16 h-16" />
                    </div>
                    <div className="flex-grow text-center lg:text-left relative z-10">
                        <h3 className="text-3xl font-black mb-2 tracking-tight">Assinatura Digital Fácil</h3>
                        <p className="text-blue-100/80 text-lg font-medium">Proteja os seus negócios com contratos digitais juridicamente válidos em Angola.</p>
                    </div>
                    <button
                        onClick={onActivateSignature}
                        className="bg-white text-facil-blue px-12 py-5 rounded-xl font-black hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 whitespace-nowrap relative z-10"
                    >
                        ATIVAR AGORA
                    </button>
                </div>
            </div>
        </div>
    );
};
