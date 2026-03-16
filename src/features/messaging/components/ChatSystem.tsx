
import React from 'react';
import { User, Message, Listing } from '../../../shared/types';
import { MessageSquare, X } from 'lucide-react';

interface ChatSystemProps {
    currentUser: User;
    listing: Listing;
    owner: User;
    messages: Message[];
    onSendMessage: (listingId: string, receiverId: string, content: string) => void;
    onClose: () => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                <div className="bg-facil-blue p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-bold">Chat de Negociação</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow flex items-center justify-center text-slate-400 p-8 text-center">
                    <div>
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium italic">O sistema de chat está sendo atualizado para sua segurança.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
