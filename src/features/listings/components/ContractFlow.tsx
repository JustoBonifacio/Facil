
import React from 'react';
import { FileText, X } from 'lucide-react';
import { Listing, User } from '../../../shared/types';

interface ContractFlowProps {
    listing: Listing;
    client: User;
    onComplete: () => void;
    onCancel: () => void;
}

export const ContractFlow: React.FC<ContractFlowProps> = ({ onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-facil-blue" />
                        <span className="font-bold text-lg">Assinatura Digital de Contrato</span>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Módulo de Contratos em Manutenção</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        Estamos refinando o fluxo de assinatura digital para garantir total conformidade jurídica. Por favor, tente novamente em breve.
                    </p>
                    <button 
                        onClick={onCancel}
                        className="bg-facil-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};
