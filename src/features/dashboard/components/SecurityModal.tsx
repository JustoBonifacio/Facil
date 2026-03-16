
import React from 'react';

interface SecurityModalProps {
    onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-indigo-900 text-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <span className="text-9xl">🛡️</span>
                </div>
                <h3 className="text-3xl font-black mb-6 relative z-10">Protocolo de Segurança Ativo</h3>
                <div className="space-y-6 text-indigo-100 font-medium relative z-10">
                    <div className="flex gap-4">
                        <span className="bg-white/20 h-8 w-8 rounded-full flex items-center justify-center font-bold">1</span>
                        <p>Solicite sempre o código de visita gerado pela plataforma FACIL antes de entrar no imóvel.</p>
                    </div>
                    <div className="flex gap-4">
                        <span className="bg-white/20 h-8 w-8 rounded-full flex items-center justify-center font-bold">2</span>
                        <p>Os pagamentos devem ser feitos apenas através do sistema de Garantia FACIL para assegurar a devolução em caso de problemas.</p>
                    </div>
                    <div className="flex gap-4">
                        <span className="bg-white/20 h-8 w-8 rounded-full flex items-center justify-center font-bold">3</span>
                        <p>A nossa equipa monitoriza todas as comunicações para prevenir fraudes e garantir uma experiência segura.</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-10 w-full py-4 bg-white text-indigo-900 rounded-2xl font-black hover:bg-indigo-50 transition shadow-xl"
                >
                    Entendi, Obrigado!
                </button>
            </div>
        </div>
    );
};
