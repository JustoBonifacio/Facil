
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInbox } from '../features/messaging/hooks/useInbox';
import { formatDate, formatTime } from '../shared/utils/helpers';
import { ArrowLeft, Search, MessageSquare, Send, ChevronRight, User as UserIcon, ShieldCheck } from 'lucide-react';

const InboxPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        conversations,
        selectedConversation, setSelectedConversation,
        newMessage, setNewMessage,
        searchQuery, setSearchQuery,
        handleSendMessage,
        user
    } = useInbox();

    if (!user) return null;

    return (
        <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] overflow-hidden">
            <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-64px)] flex flex-col md:flex-row shadow-2xl bg-white border-x border-gray-100">

                {/* Conversations Sidebar Sidebar */}
                <div className="w-full md:w-[450px] flex flex-col border-r border-gray-100 bg-white relative z-20">
                    <div className="p-10 border-b border-gray-50">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Canal Directo</h1>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-3">{conversations.length} CONVERSAS ATIVAS</p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-4 bg-gray-50 text-gray-400 rounded-3xl hover:bg-black hover:text-white transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Pesquisar mensagens ou imóveis..."
                                className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[2.5rem] text-sm border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-1 p-4">
                        {conversations.length === 0 ? (
                            <div className="py-24 text-center px-10">
                                <div className="h-24 w-24 bg-blue-50 text-blue-600 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <MessageSquare className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Sem Resultados</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tente outros termos de pesquisa.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const isSelected = selectedConversation?.otherUser.id === conv.otherUser.id &&
                                    selectedConversation?.listing?.id === conv.listing?.id;
                                return (
                                    <div
                                        key={`${conv.otherUser.id}-${conv.listing?.id}`}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`flex items-center p-6 cursor-pointer transition-all rounded-[2.5rem] relative group border-2 ${isSelected
                                            ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-200 translate-x-3'
                                            : 'hover:bg-gray-50 border-transparent hover:translate-x-1'
                                            }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={conv.otherUser.avatar}
                                                alt=""
                                                className={`h-16 w-16 rounded-[1.75rem] border-4 object-cover shadow-lg transition-all ${isSelected ? 'border-white/20' : 'border-gray-50'}`}
                                            />
                                            {conv.otherUser.isVerified && (
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                                                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-5 flex-grow min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className={`font-black truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{conv.otherUser.name}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ml-3 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {formatTime(conv.lastMessage.timestamp)}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate leading-tight font-medium ${isSelected ? 'text-blue-50/70' : 'text-gray-500'}`}>
                                                {conv.lastMessage.content}
                                            </p>
                                            {conv.listing && (
                                                <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${isSelected ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {conv.listing.title}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Panel Panel */}
                <div className="flex-grow flex flex-col bg-gray-50 relative overflow-hidden">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header Header */}
                            <div className="p-8 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center sticky top-0 z-30 shadow-sm">
                                <div className="relative">
                                    <img
                                        src={selectedConversation.otherUser.avatar}
                                        alt=""
                                        className="h-14 w-14 rounded-[1.75rem] border-2 border-blue-50 shadow-sm object-cover"
                                    />
                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="ml-6">
                                    <p className="text-xl font-black text-gray-900 tracking-tight">{selectedConversation.otherUser.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`h-2 w-2 rounded-full ${selectedConversation.otherUser.isVerified ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                            {selectedConversation.otherUser.isVerified ? 'CONTA VERIFICADA' : 'PERFIL PADRÃO'}
                                        </p>
                                    </div>
                                </div>

                                {selectedConversation.listing && (
                                    <button
                                        onClick={() => navigate(`/listing/${selectedConversation.listing!.id}`)}
                                        className="ml-auto bg-gray-900 text-white p-4 rounded-3xl shadow-xl shadow-gray-200 flex items-center gap-3 group transition-all hover:scale-105 active:scale-95"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[8px] font-black opacity-50 uppercase tracking-widest">Sobre o Imóvel</p>
                                            <p className="text-xs font-black truncate max-w-[150px]">{selectedConversation.listing.title}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>

                            {/* Message Feed Feed */}
                            <div className="flex-grow p-10 overflow-y-auto space-y-10 scroll-smooth">
                                {selectedConversation.messages.map((message, index) => {
                                    const isMine = message.senderId === user.id;
                                    const showDate = index === 0 ||
                                        new Date(message.timestamp).toDateString() !==
                                        new Date(selectedConversation.messages[index - 1].timestamp).toDateString();

                                    return (
                                        <React.Fragment key={message.id}>
                                            {showDate && (
                                                <div className="flex items-center gap-6 py-6 opacity-30">
                                                    <div className="h-px flex-grow bg-gray-400"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                                                        {formatDate(message.timestamp, 'long')}
                                                    </span>
                                                    <div className="h-px flex-grow bg-gray-400"></div>
                                                </div>
                                            )}
                                            <div className={`flex items-end gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                {!isMine && (
                                                    <img src={selectedConversation.otherUser.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0 mb-1" />
                                                )}
                                                <div className={`max-w-[80%] group ${isMine ? 'text-right' : 'text-left'}`}>
                                                    <div className={`p-6 rounded-[2.5rem] shadow-sm relative transition-all duration-300 ${isMine
                                                        ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100 hover:shadow-blue-200'
                                                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                                        }`}>
                                                        <p className="text-lg font-medium leading-relaxed">{message.content}</p>
                                                    </div>
                                                    <p className={`text-[9px] font-black uppercase tracking-widest mt-2 px-2 transition-opacity opacity-0 group-hover:opacity-100 ${isMine ? 'text-blue-400' : 'text-gray-400'}`}>
                                                        {formatTime(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Message Entry Area Area */}
                            <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-gray-100">
                                <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-6 items-center">
                                    <div className="flex-grow relative group">
                                        <div className="absolute -inset-1 bg-blue-600/5 rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Escreva a sua mensagem aqui..."
                                            className="w-full p-6 pl-10 pr-20 bg-gray-50 rounded-[2.5rem] outline-none border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all font-bold placeholder:text-gray-300 shadow-sm relative z-10 text-lg"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex gap-3">
                                            <div className="p-3 text-gray-300 cursor-pointer hover:text-blue-600 transition-colors">📎</div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="h-20 w-20 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl shadow-blue-200 flex items-center justify-center group/btn transition-all active:scale-95 disabled:opacity-20 flex-shrink-0"
                                    >
                                        <Send className="w-8 h-8 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center p-20">
                            <div className="text-center max-w-sm space-y-10 animate-in zoom-in-95 duration-700">
                                <div className="h-40 w-40 bg-white rounded-[4rem] shadow-2xl flex items-center justify-center mx-auto text-6xl relative group">
                                    <div className="absolute inset-0 bg-blue-600/5 rounded-full scale-110 blur-2xl group-hover:scale-125 transition duration-1000"></div>
                                    <div className="relative">💬</div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Seleccione uma Conversa</h3>
                                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest leading-loose">
                                        Inicie negociações seguras directamente com parceiros verificados FACIL.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-10 border-t border-gray-100 opacity-50">
                                    <div className="text-center">
                                        <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                                        <p className="text-[8px] font-black tracking-widest">ENCRIPTADO</p>
                                    </div>
                                    <div className="text-center">
                                        <UserIcon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                        <p className="text-[8px] font-black tracking-widest">VERIFICADO</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
