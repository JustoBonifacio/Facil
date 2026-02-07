
import React, { useState } from 'react';
import { Listing, User, TransactionType } from '../types';

interface ContractFlowProps {
    listing: Listing;
    client: User;
    onComplete: () => void;
    onCancel: () => void;
}

const ContractFlow: React.FC<ContractFlowProps> = ({
    listing,
    client,
    onComplete,
    onCancel
}) => {
    const [step, setStep] = useState(1);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
            <div className="bg-white max-w-2xl w-full rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-12">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex gap-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-2 w-12 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
                            ))}
                        </div>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Revisão da Proposta</h2>
                            <p className="text-gray-500 mb-10">Confirme os detalhes da transação antes de gerar o contrato digital.</p>

                            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-8 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Item</span>
                                    <span className="font-bold text-gray-900 text-right">{listing.title}</span>
                                </div>
                                <div className="flex justify-between border-t pt-4">
                                    <span className="text-gray-500 font-medium">Tipo</span>
                                    <span className="font-bold text-blue-700 uppercase tracking-widest text-xs">
                                        {listing.transactionType === TransactionType.RENT ? 'Arrendamento Mensal' : 'Compra e Venda'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-4">
                                    <span className="text-gray-500 font-medium">Valor Total</span>
                                    <span className="font-black text-2xl text-gray-900">{listing.price.toLocaleString()} AOA</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition"
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Cláusulas Digitais</h2>
                            <p className="text-gray-500 mb-8">O nosso contrato inteligente garante a segurança de ambas as partes.</p>

                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8 h-48 overflow-y-auto text-xs text-gray-600 leading-relaxed font-mono">
                                CLÁUSULA 1ª: O proprietário declara ser o legítimo detentor do bem...
                                CLÁUSULA 2ª: O pagamento será processado via FACIL PAY mediante confirmação da entrega...
                                CLÁUSULA 3ª: Em caso de litígio, as partes aceitam a mediação da plataforma...
                                [CONTEÚDO DINÂMICO DO CONTRATO]
                            </div>

                            <div className="flex items-center mb-8 bg-blue-50 p-4 rounded-2xl cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                                <div className={`h-6 w-6 rounded-lg mr-4 flex items-center justify-center border-2 transition ${acceptedTerms ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                                    {acceptedTerms && <span className="text-white">✓</span>}
                                </div>
                                <span className="text-sm text-blue-900 font-medium">Aceito as condições e confirmo a veracidade dos meus dados.</span>
                            </div>

                            <button
                                disabled={!acceptedTerms}
                                onClick={() => setStep(3)}
                                className={`w-full py-5 rounded-2xl font-black shadow-xl transition ${acceptedTerms ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                Assinar Digitalmente
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center animate-in zoom-in-95 duration-500">
                            <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">✓</div>
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Contrato Gerado!</h2>
                            <p className="text-gray-500 mb-10 max-w-sm mx-auto">
                                A sua assinatura digital foi aplicada. Notificámos o proprietário para a contra-assinatura.
                            </p>

                            <button
                                onClick={onComplete}
                                className="w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl hover:bg-gray-800 transition"
                            >
                                Ir para os Meus Negócios
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractFlow;
