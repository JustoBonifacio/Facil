
import React, { useState } from 'react';
import { User, Message, Listing } from '../types';

interface InboxProps {
    currentUser: User;
    messages: Message[];
    listings: Listing[];
    users: User[];
    onSendMessage: (listingId: string, receiverId: string, content: string) => void;
    onNavigateToListing: (id: string) => void;
}

const Inbox: React.FC<InboxProps> = ({
    currentUser,
    messages,
    listings,
    users,
    onSendMessage,
    onNavigateToListing
}) => {
    const [selectedChat, setSelectedChat] = useState<{ listingId: string, otherUserId: string } | null>(null);
    const [newMessage, setNewMessage] = useState('');

    // Group messages by chat (listing + other user)
    const chatsMap = new Map();
    messages.forEach(m => {
        const otherUserId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
        const chatKey = `${m.listingId}-${otherUserId}`;
        if (!chatsMap.has(chatKey)) {
            chatsMap.set(chatKey, {
                listingId: m.listingId,
                otherUserId,
                lastMessage: m,
                messages: []
            });
        }
        const chat = chatsMap.get(chatKey);
        chat.messages.push(m);
        if (new Date(m.timestamp) > new Date(chat.lastMessage.timestamp)) {
            chat.lastMessage = m;
        }
    });

    const chats = Array.from(chatsMap.values()).sort((a, b) =>
        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );

    const activeChat = selectedChat ? chats.find(c => c.listingId === selectedChat.listingId && c.otherUserId === selectedChat.otherUserId) : null;
    const otherUser = activeChat ? users.find(u => u.id === activeChat.otherUserId) : null;
    const activeListing = activeChat ? listings.find(l => l.id === activeChat.listingId) : null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-160px)] flex flex-col">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Mensagens</h1>

            <div className="flex-grow flex bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 border-r flex flex-col">
                    <div className="p-6 border-b">
                        <input
                            type="text"
                            placeholder="Pesquisar conversas..."
                            className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {chats.map(chat => {
                            const u = users.find(usr => usr.id === chat.otherUserId);
                            const l = listings.find(lst => lst.id === chat.listingId);
                            const isActive = selectedChat?.listingId === chat.listingId && selectedChat?.otherUserId === chat.otherUserId;

                            return (
                                <div
                                    key={`${chat.listingId}-${chat.otherUserId}`}
                                    onClick={() => setSelectedChat({ listingId: chat.listingId, otherUserId: chat.otherUserId })}
                                    className={`p-6 cursor-pointer border-b last:border-0 hover:bg-gray-50 transition ${isActive ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''}`}
                                >
                                    <div className="flex items-center">
                                        <img src={u?.avatar} className="h-12 w-12 rounded-full mr-4" alt="" />
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className="font-bold text-gray-900 truncate">{u?.name}</p>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-tighter truncate mb-1">{l?.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage.content}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {chats.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">Nenhuma conversa iniciada.</div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-gray-50/30">
                    {activeChat && otherUser && activeListing ? (
                        <>
                            {/* Header */}
                            <div className="p-6 bg-white border-b flex justify-between items-center">
                                <div className="flex items-center">
                                    <img src={otherUser.avatar} className="h-10 w-10 rounded-full mr-3" alt="" />
                                    <div>
                                        <p className="font-bold text-gray-900">{otherUser.name}</p>
                                        <p className="text-xs text-blue-600 font-bold uppercase cursor-pointer hover:underline" onClick={() => onNavigateToListing(activeListing.id)}>
                                            Anúncio: {activeListing.title}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow p-8 overflow-y-auto flex flex-col space-y-4">
                                {activeChat.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(m => {
                                    const isMine = m.senderId === currentUser.id;
                                    return (
                                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'}`}>
                                                {m.content}
                                                <div className={`text-[9px] mt-1 font-bold uppercase tracking-tighter ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input */}
                            <div className="p-6 bg-white border-t">
                                <form
                                    className="flex space-x-4"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!newMessage.trim()) return;
                                        onSendMessage(activeChat.listingId, activeChat.otherUserId, newMessage);
                                        setNewMessage('');
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Escreva a sua mensagem..."
                                        className="flex-grow bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 transition"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                    >
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                            <span className="text-6xl mb-4">💬</span>
                            <p className="font-bold uppercase tracking-widest text-sm">Selecione uma conversa para começar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
