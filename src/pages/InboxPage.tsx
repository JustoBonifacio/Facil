
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Message, User, Listing } from '../types';
import { formatDate, formatTime } from '../utils/helpers';
import { ArrowLeft, Search, MessageSquare, Send, Info, ChevronRight } from 'lucide-react';

interface Conversation {
    otherUser: User;
    listing: Listing | null;
    lastMessage: Message;
    messages: Message[];
    unreadCount: number;
}

const InboxPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useApp();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');

    if (!state.user) return null;

    // Group messages into conversations
    const conversations = useMemo<Conversation[]>(() => {
        const userMessages = state.messages.filter(m =>
            m.senderId === state.user!.id || m.receiverId === state.user!.id
        );

        const conversationMap = new Map<string, Message[]>();

        userMessages.forEach(message => {
            const otherUserId = message.senderId === state.user!.id ? message.receiverId : message.senderId;
            const key = `${otherUserId}-${message.listingId}`;

            if (!conversationMap.has(key)) {
                conversationMap.set(key, []);
            }
            conversationMap.get(key)!.push(message);
        });

        return Array.from(conversationMap.entries()).map(([key, messages]) => {
            const [otherUserId, listingId] = key.split('-');
            const otherUser = state.users.find(u => u.id === otherUserId)!;
            const listing = state.listings.find(l => l.id === listingId) || null;
            const sortedMessages = [...messages].sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            const lastMessage = sortedMessages[sortedMessages.length - 1];

            return {
                otherUser,
                listing,
                lastMessage,
                messages: sortedMessages,
                unreadCount: 0, // TODO: implement read status
            };
        }).sort((a, b) =>
            new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        );
    }, [state.messages, state.user, state.users, state.listings]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        actions.sendMessage(
            selectedConversation.listing?.id || '',
            selectedConversation.otherUser.id,
            newMessage
        );
        setNewMessage('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Mensagens</h1>
                    <p className="text-gray-500">{conversations.length} conversas</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-400 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group transition-all"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Dashboard
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 min-h-[600px] flex">
                {/* Conversations List */}
                <div className="w-full md:w-1/3 border-r border-gray-100">
                    <div className="p-6 border-b border-gray-100 relative">
                        <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-bold placeholder:text-gray-300"
                        />
                    </div>

                    <div className="overflow-y-auto" style={{ height: 'calc(600px - 70px)' }}>
                        {conversations.length === 0 ? (
                            <div className="p-12 text-center">
                                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sem mensagens</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={`${conv.otherUser.id}-${conv.listing?.id}`}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`flex items-center p-4 cursor-pointer transition border-b border-gray-50 ${selectedConversation?.otherUser.id === conv.otherUser.id &&
                                        selectedConversation?.listing?.id === conv.listing?.id
                                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={conv.otherUser.avatar}
                                            alt=""
                                            className="h-14 w-14 rounded-full"
                                        />
                                        {conv.unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-gray-900 truncate">{conv.otherUser.name}</p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {formatDate(conv.lastMessage.timestamp, 'relative')}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm truncate">{conv.lastMessage.content}</p>
                                        {conv.listing && (
                                            <p className="text-[10px] text-blue-600 font-medium truncate mt-1">
                                                Re: {conv.listing.title}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-col flex-grow">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-5 border-b border-gray-100 flex items-center">
                                <img
                                    src={selectedConversation.otherUser.avatar}
                                    alt=""
                                    className="h-12 w-12 rounded-full"
                                />
                                <div className="ml-4">
                                    <p className="font-bold text-gray-900">{selectedConversation.otherUser.name}</p>
                                    {selectedConversation.listing && (
                                        <p className="text-sm text-blue-600 truncate max-w-[300px]">
                                            Re: {selectedConversation.listing.title}
                                        </p>
                                    )}
                                </div>
                                {selectedConversation.listing && (
                                    <button
                                        onClick={() => navigate(`/listing/${selectedConversation.listing!.id}`)}
                                        className="ml-auto text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                                    >
                                        Ver anúncio <ChevronRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* Messages */}
                            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50">
                                {selectedConversation.messages.map((message, index) => {
                                    const isMine = message.senderId === state.user!.id;
                                    const showDate = index === 0 ||
                                        new Date(message.timestamp).toDateString() !==
                                        new Date(selectedConversation.messages[index - 1].timestamp).toDateString();

                                    return (
                                        <React.Fragment key={message.id}>
                                            {showDate && (
                                                <div className="text-center text-xs text-gray-400 py-2">
                                                    {formatDate(message.timestamp, 'long')}
                                                </div>
                                            )}
                                            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-4 rounded-2xl ${isMine
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
                                                    }`}>
                                                    <p className="text-sm">{message.content}</p>
                                                    <p className={`text-[10px] mt-2 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 flex gap-4 bg-white">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escreva a sua mensagem..."
                                    className="flex-grow p-5 bg-gray-50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 rounded-[1.5rem] font-black hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center bg-gray-50/30">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-sm flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="w-10 h-10 text-gray-200" />
                                </div>
                                <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Selecione uma conversa</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
