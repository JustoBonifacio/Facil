
import React, { useState } from 'react';
import { User, Message, Listing } from '../types';

interface ChatSystemProps {
    currentUser: User;
    listing: Listing;
    owner: User;
    messages: Message[];
    onSendMessage: (listingId: string, receiverId: string, content: string) => void;
    onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
    currentUser,
    listing,
    owner,
    messages,
    onSendMessage,
    onClose
}) => {
    const [content, setContent] = useState('');

    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-[32px] shadow-2xl flex flex-col z-[100] border border-blue-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            {/* Header */}
            <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <img src={owner.avatar} className="h-10 w-10 rounded-full border-2 border-white/20" alt="" />
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                    </div>
                    <div className="ml-3">
                        <p className="font-bold text-sm leading-none mb-1">{owner.name}</p>
                        <p className="text-[10px] text-blue-100 font-bold uppercase tracking-tighter truncate max-w-[180px]">Re: {listing.title}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50/50">
                {messages.map(m => {
                    const isMine = m.senderId === currentUser.id;
                    return (
                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-xs shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'}`}>
                                {m.content}
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-xs italic">Inicie a conversa sobre este item.</p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t">
                <form
                    className="flex space-x-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!content.trim()) return;
                        onSendMessage(listing.id, owner.id, content);
                        setContent('');
                    }}
                >
                    <input
                        type="text"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Mensagem..."
                        className="flex-grow bg-gray-100 p-3 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        ✈
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatSystem;
