
import React from 'react';
import { Check } from 'lucide-react';

interface FaceScanModalProps {
    step: 'idle' | 'scanning' | 'analyzing' | 'success';
    videoRef: React.RefObject<HTMLVideoElement | null>;
    onStartScan: () => void;
    onClose: () => void;
}

export const FaceScanModal: React.FC<FaceScanModalProps> = ({
    step,
    videoRef,
    onStartScan,
    onClose
}) => {
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-indigo-950/90 backdrop-blur-xl p-4">
            <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-500">
                <div className="p-10 text-center">
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Biometria Facial</h3>
                    <p className="text-gray-500 font-medium">Posicione o seu rosto no centro da moldura.</p>
                </div>

                <div className="relative aspect-square mx-10 bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-gray-100">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-cover grayscale transition-all duration-700 ${step === 'success' ? 'grayscale-0 scale-110' : ''}`}
                    />

                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className={`w-full h-full border-4 border-dashed rounded-full transition-all duration-1000 ${step === 'scanning' ? 'border-indigo-500 animate-pulse scale-105' : 'border-white/30'}`}></div>
                    </div>

                    {step === 'scanning' && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-scan-line"></div>
                    )}

                    {step === 'analyzing' && (
                        <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="text-center group">
                                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-white font-black text-xs uppercase tracking-widest">Analisando Pontos Faciais...</p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="absolute inset-0 bg-emerald-500/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
                            <div className="text-center scale-110">
                                <div className="w-24 h-24 bg-white text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                    <Check className="w-12 h-12 stroke-[4px]" />
                                </div>
                                <p className="text-white font-black text-xl">Identidade Confirmada</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-10 flex flex-col gap-4">
                    {step === 'idle' && (
                        <button
                            onClick={onStartScan}
                            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3"
                        >
                            Começar Mapeamento
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition"
                    >
                        Cancelar Processo
                    </button>
                </div>

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>
            </div>
        </div>
    );
};
