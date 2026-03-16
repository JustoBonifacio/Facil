
import React from 'react';

interface SuccessToastProps {
    message: string;
    onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ message, onClose }) => {
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[400] animate-in slide-in-from-bottom-5">
            <div className="bg-black text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
                <span>🚀</span>
                {message}
                <button
                    onClick={onClose}
                    className="ml-4 text-white/50 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
