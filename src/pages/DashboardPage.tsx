
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ListingCard } from '../components';
import { ListingStatus } from '../types';
import { formatDate } from '../utils/helpers';
import {
    Zap, Home, Heart, Scale, Calendar, LineChart, FileText,
    MessageSquare, Star, Plus, ShieldCheck, ShieldAlert,
    Clock, Search, Folder, ChevronRight, LayoutTemplate,
    Crop, Maximize, Check, X, UserCheck, Smartphone, Mail, MapPin,
    CreditCard, BadgeCheck, AlertTriangle, ScanFace, Camera
} from 'lucide-react';
import Cropper from 'react-easy-crop';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { state, actions } = useApp();
    const [activeTab, setActiveTab] = useState<'activity' | 'listings' | 'documents' | 'appointments' | 'collections' | 'comparison' | 'market' | 'verification'>('activity');

    // UI Local States
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListDesc, setNewListDesc] = useState('');
    const [isAlertActive, setIsAlertActive] = useState(true);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
    const [uploadingType, setUploadingType] = useState<'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS' | 'OTHER' | null>(null);
    const [showFaceScanModal, setShowFaceScanModal] = useState(false);
    const [faceScanStep, setFaceScanStep] = useState<'idle' | 'scanning' | 'analyzing' | 'success'>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const verificationInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Cropper States
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    if (!state.user) return null;

    const userListings = state.listings.filter(l => l.ownerId === state.user!.id);
    const userDocuments = state.userDocuments.filter(d => d.userId === state.user!.id);
    const userMessages = state.messages.filter(m =>
        m.receiverId === state.user!.id || m.senderId === state.user!.id
    );

    const favoriteListings = state.listings.filter(l => state.user?.favorites?.includes(l.id));

    const scanLineStyles = (
        <style>{`
            @keyframes scan-line {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            .animate-scan-line {
                position: absolute;
                width: 100%;
                height: 2px;
                background: #6366f1;
                box-shadow: 0 0 15px #6366f1, 0 0 5px #fff;
                animation: scan-line 2s linear infinite;
            }
        `}</style>
    );


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, customType?: 'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS' | 'OTHER') => {
        const file = event.target.files?.[0];
        const docType = customType || uploadingType || 'OTHER';

        if (file && state.user) {
            // Simulator update
            const newDoc = {
                id: Date.now().toString(),
                userId: state.user.id,
                type: docType,
                url: URL.createObjectURL(file),
                status: 'PENDING' as any,
                createdAt: new Date().toISOString()
            };
            actions.addDocument(newDoc);

            const typeNames: Record<string, string> = {
                'ID_CARD': 'Identidade (BI)',
                'TAX_ID': 'NIF / Contribuinte',
                'PROOF_ADDRESS': 'Prova de Residência',
                'OTHER': 'Documento'
            };

            setShowSuccessToast(`${typeNames[docType] || 'Documento'} "${file.name}" carregado para análise!`);
            setUploadingType(null);
        }
    };

    const triggerVerificationUpload = (type: 'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS') => {
        setUploadingType(type);
        setTimeout(() => verificationInputRef.current?.click(), 100);
    };

    const startFaceScan = async () => {
        setShowFaceScanModal(true);
        setFaceScanStep('idle');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            console.error("Camera access error:", err);
            setShowSuccessToast("Erro ao aceder à câmara. Verifique as permissões.");
            setShowFaceScanModal(false);
        }
    };

    const stopFaceScan = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowFaceScanModal(false);
    };

    const handleFaceScan = () => {
        setFaceScanStep('scanning');
        setTimeout(() => setFaceScanStep('analyzing'), 3000);
        setTimeout(() => {
            setFaceScanStep('success');
            setShowSuccessToast("Identidade biométrica verificada com sucesso!");
            setTimeout(() => stopFaceScan(), 2000);
        }, 6000);
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageToCrop(reader.result as string));
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const generateCroppedImage = async () => {
        if (!imageToCrop || !croppedAreaPixels) return;

        try {
            const image = new Image();
            image.src = imageToCrop;

            await new Promise((resolve) => { image.onload = resolve; });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const croppedImageUrl = canvas.toDataURL('image/jpeg');
            actions.updateAvatar(croppedImageUrl);
            setImageToCrop(null);
            setShowSuccessToast('Foto de perfil recortada e atualizada!');
        } catch (e) {
            console.error(e);
        }
    };

    const totalViews = userListings.reduce((sum, l) => sum + l.views, 0);

    const stats = [
        { label: 'Favoritos', value: favoriteListings.length, icon: <Heart className="w-5 h-5" /> },
        ...(state.user.role !== 'CLIENT' ? [{ label: 'Meus Anúncios', value: userListings.length, icon: <LayoutTemplate className="w-5 h-5" /> }] : []),
        { label: 'Mensagens', value: userMessages.length, icon: <MessageSquare className="w-5 h-5" /> },
        { label: 'Avaliação', value: state.user.rating.toFixed(1), icon: <Star className="w-5 h-5" /> },
    ];

    const tabs = [
        { id: 'activity', label: 'Minha Atividade', icon: <Zap className="w-5 h-5" /> },
        ...(state.user.role !== 'CLIENT' ? [{ id: 'listings', label: 'Gerir Anúncios', icon: <Home className="w-5 h-5" /> }] : []),
        { id: 'collections', label: 'Coleções', icon: <Heart className="w-5 h-5" /> },
        { id: 'comparison', label: 'Comparar', icon: <Scale className="w-5 h-5" /> },
        { id: 'appointments', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
        { id: 'market', label: 'Mercado', icon: <LineChart className="w-5 h-5" /> },
        { id: 'documents', label: 'Cofre Digital', icon: <FileText className="w-5 h-5" /> },
        { id: 'verification', label: 'Verificação', icon: <BadgeCheck className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {scanLineStyles}
            {/* Header com Perfil Pro */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <span className="text-9xl">🏠</span>
                </div>

                <div className="flex items-center relative z-10">
                    <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                        <input
                            type="file"
                            ref={avatarInputRef}
                            className="hidden"
                            onChange={handleAvatarUpload}
                            accept="image/*"
                        />
                        <img
                            src={state.user.avatar}
                            alt={state.user.name}
                            className="h-24 w-24 rounded-full border-4 border-white/30 shadow-2xl object-cover transition-all group-hover:brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                        {state.user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white" title="Perfil Verificado">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    <div className="ml-6">
                        <h1 className="text-4xl font-black">{state.user.name}</h1>
                        <p className="text-blue-100 opacity-80 mt-1 font-medium">{state.user.role === 'OWNER' ? 'Proprietário Premium' : 'Cliente Verificado'}</p>
                        <div className="flex items-center mt-3 gap-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
                                {state.user.isVerified ? '✓ Documentação Validada' : '⚠ Verificação em curso'}
                            </span>
                        </div>
                        {/* Render stats cards here */}
                        <div className="flex flex-wrap gap-4 mt-6">
                            {stats.map(stat => (
                                <div key={stat.label} className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                    <span className="text-[10px] font-black uppercase opacity-60 block tracking-widest">{stat.label}</span>
                                    <span className="text-lg font-black">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-0 flex gap-3 relative z-10">
                    {state.user.role !== 'CLIENT' && (
                        <button
                            onClick={() => navigate('/create')}
                            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition shadow-xl hover:scale-105 active:scale-95"
                        >
                            + Criar Anúncio
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/god-mode')}
                        className="bg-black/20 hover:bg-black/30 text-white p-4 rounded-2xl backdrop-blur-sm transition"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            {/* Sub-Navegação (Abas) */}
            <div className="flex flex-wrap gap-2 mb-8 bg-gray-100/50 p-2 rounded-3xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white text-blue-600 shadow-md transform scale-105'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo Dinâmico Baseado na Aba */}
            <div className="space-y-10">
                {activeTab === 'activity' && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Favoritos */}
                            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                        Meus Favoritos <Heart className="w-6 h-6 text-red-500 fill-current" />
                                    </h2>
                                    <button
                                        onClick={() => setActiveTab('collections')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Ver todos
                                    </button>
                                </div>
                                {favoriteListings.length === 0 ? (
                                    <div className="text-center py-10 opacity-50">
                                        <div className="text-4xl mb-2">🔭</div>
                                        <p className="font-medium italic">Ainda não guardou nenhum imóvel.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {favoriteListings.slice(0, 3).map(listing => (
                                            <div key={listing.id} onClick={() => navigate(`/listing/${listing.id}`)} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition">
                                                <img src={listing.images[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                                                <div>
                                                    <p className="font-bold text-gray-900 line-clamp-1">{listing.title}</p>
                                                    <p className="text-blue-600 font-black">{listing.price.toLocaleString()} {listing.currency}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Alertas Inteligentes */}
                            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                        Alertas Ativos <Clock className="w-6 h-6 text-blue-600" />
                                    </h2>
                                    <button
                                        onClick={() => setShowSuccessToast('Funcionalidade de alerta inteligente ativada!')}
                                        className="bg-gray-100 p-2 rounded-xl text-lg hover:bg-gray-200"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {state.searchAlerts.length === 0 ? (
                                        <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                                            <p className="font-bold text-gray-300 italic">Sem alertas configurados</p>
                                        </div>
                                    ) : (
                                        state.searchAlerts.map(alert => (
                                            <div key={alert.id} className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 p-2 rounded-lg text-xl">🔔</div>
                                                    <div>
                                                        <p className="font-bold text-blue-900">{alert.title}</p>
                                                        <p className="text-xs text-blue-600">
                                                            Filtros: {alert.filters.category} | {alert.filters.maxPrice ? `Até ${alert.filters.maxPrice.toLocaleString()} Kz` : 'Qualquer preço'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div
                                                        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${alert.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alert.isActive ? 'right-1' : 'left-1'}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <p className="text-xs text-center text-gray-400 font-medium">Receberá notificações no browser quando houver novidades.</p>
                                </div>
                            </section>
                        </div>

                        {/* Histórico de Pesquisa */}
                        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mt-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                    Pesquisas Recentes <Search className="w-6 h-6 text-gray-500" />
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {state.searchHistory.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">Nenhuma pesquisa guardada.</p>
                                ) : (
                                    state.searchHistory.slice(0, 3).map(h => (
                                        <div key={h.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100 hover:border-blue-200 transition">
                                            <div>
                                                <p className="font-bold text-gray-900">"{h.query || 'Filtros aplicados'}"</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{formatDate(h.createdAt)}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/?query=${h.query}`)}
                                                className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition text-blue-600 font-bold"
                                            >
                                                🔍 REPETIR
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Visualizados Recentemente */}
                        <section className="mt-10">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 px-4 flex items-center gap-2">
                                Visualizados Recentemente <Clock className="w-6 h-6 text-gray-500" />
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {state.listings.slice(0, 5).map(listing => (
                                    <div key={listing.id} onClick={() => navigate(`/listing/${listing.id}`)} className="bg-white p-2 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">
                                        <div className="relative overflow-hidden rounded-2xl aspect-square">
                                            <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-bold text-gray-500 truncate">{listing.location.city}</p>
                                            <p className="font-black text-gray-900 truncate">{listing.price.toLocaleString()} Kz</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-black text-gray-900">Os Meus Anúncios</h2>
                            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-bold">{userListings.length} total</span>
                        </div>

                        {userListings.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                <span className="text-7xl mb-4 block">📦</span>
                                <h3 className="text-2xl font-black text-gray-800">Ainda não tem anúncios</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Crie o seu primeiro anúncio para começar a vender ou alugar na plataforma.</p>
                                <button
                                    onClick={() => navigate('/create')}
                                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg"
                                >
                                    + Criar Primeiro Anúncio
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {userListings.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        listing={listing}
                                        onClick={(id) => navigate(`/listing/${id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
                                <span className="bg-blue-100 p-3 rounded-2xl mr-4 text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </span>
                                Agenda de Visitas
                            </h2>
                            <div className="flex-grow space-y-4">
                                {state.appointments.length === 0 ? (
                                    <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Sem eventos agendados</p>
                                    </div>
                                ) : (
                                    state.appointments.map(appt => {
                                        const listing = state.listings.find(l => l.id === appt.listingId);
                                        const apptDate = new Date(appt.date);
                                        return (
                                            <div key={appt.id} className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
                                                <div className="flex items-center gap-5">
                                                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-blue-100 text-center min-w-[70px]">
                                                        <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                                            {apptDate.toLocaleString('pt-PT', { month: 'short' })}
                                                        </span>
                                                        <span className="block text-2xl font-black text-blue-700">
                                                            {apptDate.getDate()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4
                                                            onClick={() => listing && navigate(`/listing/${listing.id}`)}
                                                            className="font-black text-gray-900 line-clamp-1 hover:text-blue-600 cursor-pointer transition"
                                                        >
                                                            {listing?.title || 'Imóvel'}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">
                                                            {apptDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {appt.status}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowSuccessToast('Detalhes do agendamento sincronizados com Google Calendar.')}
                                                    className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-gray-400 hover:text-blue-600"
                                                >
                                                    ➡️
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-indigo-900 to-blue-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[400px]">
                            <div className="absolute top-10 right-10 text-9xl opacity-10 animate-pulse">🛡️</div>
                            <div className="relative z-10">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Dica de Pró</span>
                                <h3 className="text-3xl font-black mb-4 tracking-tight">Visitas Seguras</h3>
                                <p className="text-blue-100/70 mb-8 leading-relaxed font-medium">
                                    Todas as visitas agendadas via FACIL incluem um código de segurança único.
                                    Nunca visite um imóvel sem o seu código ativo no dashboard.
                                </p>
                                <button
                                    onClick={() => setShowSecurityModal(true)}
                                    className="w-full py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
                                >
                                    Aprender Protocolo de Segurança
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="animate-fade-in">
                        <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Cofre Digital</h2>
                                    <p className="text-gray-500 font-bold text-lg mt-2">Segurança máxima para os seus documentos de identificação.</p>
                                </div>
                                <div className="bg-green-50 text-green-700 px-8 py-4 rounded-[2rem] font-black flex items-center gap-3 border border-green-100 shadow-sm">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    VERIFICAÇÃO COMPLETA
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {userDocuments.map(doc => (
                                    <div key={doc.id} className="p-8 rounded-[3rem] border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                        <div className="text-blue-600 mb-6 transform group-hover:scale-110 transition duration-500">
                                            {doc.type === 'ID_CARD' ? <ShieldCheck className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                        </div>
                                        <h4 className="font-black text-gray-900 mb-2 text-xl">
                                            {doc.type === 'ID_CARD' ? 'Bilhete de Identidade' :
                                                doc.type === 'TAX_ID' ? 'NIF / Contribuinte' :
                                                    doc.type === 'PROOF_ADDRESS' ? 'Prova de Residência' : 'Documento Extra'}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-8">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-widest ${doc.status === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                                                doc.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => window.open(doc.url, '_blank')}
                                            className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-sm text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                                        >
                                            Visualizar
                                        </button>
                                    </div>
                                ))}

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-4 border-dashed border-gray-100 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group"
                                >
                                    <div className="h-20 w-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-xl shadow-blue-200 group-hover:rotate-90 transition duration-500">
                                        +
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-gray-800 text-xl">Novo Ficheiro</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Até 10MB · PDF/PNG</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[3.5rem] p-12 text-white flex flex-col lg:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <div className="text-white/20 p-6 bg-white/10 rounded-3xl backdrop-blur-md">
                                    <ShieldCheck className="w-16 h-16" />
                                </div>
                                <div className="flex-grow text-center lg:text-left relative z-10">
                                    <h3 className="text-3xl font-black mb-2 tracking-tight">Assinatura Digital FACIL</h3>
                                    <p className="text-blue-100/80 text-lg font-medium">Proteja os seus negócios com contratos digitais juridicamente válidos em Angola.</p>
                                </div>
                                <button
                                    onClick={() => setShowSuccessToast('Certificado de Assinatura Digital emitido com sucesso!')}
                                    className="bg-white text-blue-700 px-12 py-5 rounded-[2rem] font-black hover:bg-blue-50 transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap relative z-10"
                                >
                                    ATIVAR AGORA
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'verification' && (
                    <div className="animate-fade-in space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    Centro de Verificação <BadgeCheck className="w-10 h-10 text-blue-600" />
                                </h2>
                                <p className="text-gray-500 font-medium mt-2">Aumente a sua credibilidade em 85% com uma conta verificada.</p>
                            </div>
                            <div className="px-6 py-3 bg-blue-50 rounded-2xl flex items-center gap-3">
                                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 w-[80%] rounded-full shadow-sm"></div>
                                </div>
                                <span className="text-blue-700 font-black text-sm uppercase">80% Completo</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Verification Steps */}
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                                    <h3 className="text-xl font-black text-gray-900 mb-6">Etapas de Confiança</h3>

                                    {/* Step 1: Email */}
                                    <div className="flex items-center justify-between p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                                                <Mail className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">E-mail Confirmado</p>
                                                <p className="text-xs text-gray-500 font-medium">{state.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                                            <Check className="w-5 h-5" /> Verificado
                                        </div>
                                    </div>

                                    {/* Step 2: Identity */}
                                    <div className="flex items-center justify-between p-6 bg-blue-50/30 rounded-3xl border border-blue-100">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                                                <CreditCard className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">Identidade (BI)</p>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {userDocuments.some(d => d.type === 'ID_CARD')
                                                        ? 'Documento enviado e em análise'
                                                        : 'Submeta o seu BI ou Passaporte'}
                                                </p>
                                            </div>
                                        </div>
                                        {userDocuments.some(d => d.type === 'ID_CARD') ? (
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                                                    <Clock className="w-5 h-5" /> Em Análise
                                                </div>
                                                <button
                                                    onClick={() => triggerVerificationUpload('ID_CARD')}
                                                    className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => triggerVerificationUpload('ID_CARD')}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                            >
                                                Submeter
                                            </button>
                                        )}
                                    </div>

                                    {/* Step 3: NIF */}
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-blue-600 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">Cartão de Contribuinte (NIF)</p>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {userDocuments.some(d => d.type === 'TAX_ID')
                                                        ? 'Documento enviado'
                                                        : 'Opcional, mas recomendado'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => triggerVerificationUpload('TAX_ID')}
                                            className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"
                                        >
                                            {userDocuments.some(d => d.type === 'TAX_ID') ? 'Editar' : 'Verificar'}
                                        </button>
                                    </div>

                                    {/* Step 4: Face Scan - NEW */}
                                    <div className="flex items-center justify-between p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100 group hover:border-indigo-600 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                                <ScanFace className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">Reconhecimento Facial</p>
                                                <p className="text-xs text-gray-500 font-medium">Verificação de prova de vida em tempo real</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={startFaceScan}
                                            className="px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2"
                                        >
                                            <Camera className="w-4 h-4" /> Iniciar Scan
                                        </button>
                                    </div>

                                    {/* Step 5: Phone */}
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-blue-600 transition-all cursor-pointer">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-transparent group-hover:shadow-blue-100">
                                                <Smartphone className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">Telemóvel</p>
                                                <p className="text-xs text-gray-500 font-medium">Não verificado</p>
                                            </div>
                                        </div>
                                        <button className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all">
                                            Verificar
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <ShieldCheck className="w-32 h-32" />
                                    </div>
                                    <h4 className="text-xl font-black mb-4 relative z-10">Porquê ser verificado?</h4>
                                    <ul className="space-y-4 relative z-10">
                                        <li className="flex gap-3 text-sm font-medium text-blue-100">
                                            <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            Acesso a Imóveis Premium exclusivos
                                        </li>
                                        <li className="flex gap-3 text-sm font-medium text-blue-100">
                                            <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            Destaque nos resultados de pesquisa
                                        </li>
                                        <li className="flex gap-3 text-sm font-medium text-blue-100">
                                            <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            Selos de Confiança no seu perfil
                                        </li>
                                        <li className="flex gap-3 text-sm font-medium text-blue-100">
                                            <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            Suporte Prioritário 24/7
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                                    <div className="flex items-center gap-3 text-amber-800 mb-3">
                                        <AlertTriangle className="w-6 h-6" />
                                        <h4 className="font-black text-sm uppercase tracking-widest">Atenção</h4>
                                    </div>
                                    <p className="text-amber-700 text-sm font-medium leading-relaxed">
                                        Os seus dados estão protegidos por criptografia de ponta a ponta e nunca serão partilhados com terceiros sem o seu consentimento.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'comparison' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                                Comparação Lado a Lado <Scale className="w-8 h-8 text-blue-600" />
                            </h2>
                            <span className="text-sm font-bold text-gray-500">Selecione até 3 anúncios para comparar</span>
                        </div>

                        {favoriteListings.length < 2 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                <span className="text-7xl mb-4 block">⚖️</span>
                                <h3 className="text-2xl font-black text-gray-800">Precisa de mais favoritos</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Adicione pelo menos 2 anúncios aos seus favoritos para os poder comparar.</p>
                                <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black">Explorar Imóveis</button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto pb-10">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr>
                                            <th className="p-6 bg-gray-50 rounded-tl-[2rem] border-b border-gray-100">Característica</th>
                                            {favoriteListings.slice(0, 3).map(l => (
                                                <th key={l.id} className="p-6 bg-white border-b border-gray-100 min-w-[250px]">
                                                    <div className="flex flex-col gap-2">
                                                        <img src={l.images[0]} className="w-full h-32 object-cover rounded-2xl" alt="" />
                                                        <span className="font-black text-gray-900 line-clamp-1">{l.title}</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr>
                                            <td className="p-6 font-black text-gray-500 bg-gray-50/50">Preço</td>
                                            {favoriteListings.slice(0, 3).map(l => (
                                                <td key={l.id} className="p-6 font-black text-blue-600 text-lg">{l.price.toLocaleString()} {l.currency}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 font-black text-gray-500 bg-gray-50/50">Localização</td>
                                            {favoriteListings.slice(0, 3).map(l => (
                                                <td key={l.id} className="p-6 font-medium text-gray-700">{l.location.city}, {l.location.neighborhood}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 font-black text-gray-500 bg-gray-50/50">Área / Tipologia</td>
                                            {favoriteListings.slice(0, 3).map(l => (
                                                <td key={l.id} className="p-6 font-medium text-gray-700">{l.area ? `${l.area}m²` : 'N/A'} · {l.category}</td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 font-black text-gray-500 bg-gray-50/50">Extras</td>
                                            {favoriteListings.slice(0, 3).map(l => (
                                                <td key={l.id} className="p-6">
                                                    <div className="flex flex-wrap gap-1">
                                                        {l.features.slice(0, 3).map(f => (
                                                            <span key={f} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold">{f}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 bg-gray-50 rounded-bl-[2rem]"></td>
                                            {favoriteListings.slice(0, 3).map(l => (
                                                <td key={l.id} className="p-6">
                                                    <button onClick={() => navigate(`/listing/${l.id}`)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">Ver Detalhes</button>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'market' && (
                    <div className="animate-fade-in space-y-10">
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                                <LineChart className="w-10 h-10 text-blue-600" /> Tendências de Preço na Zona
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <LineChart className="w-4 h-4 text-blue-400" />
                                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Preço Médio Talatona</p>
                                    </div>
                                    <h4 className="text-3xl font-black text-blue-900">450.000 Kz <span className="text-sm font-bold text-green-500">↑ 4%</span></h4>
                                    <p className="text-xs text-blue-600 mt-2">Baseado em 142 anúncios este mês</p>
                                </div>
                                <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Procura vs Oferta</p>
                                    <h4 className="text-3xl font-black text-indigo-900">ALTA</h4>
                                    <p className="text-xs text-indigo-600 mt-2">Média de 12 contactos por anúncio</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tempo Médio Venda</p>
                                    <h4 className="text-3xl font-black text-gray-900">42 Dias</h4>
                                    <p className="text-xs text-gray-500 mt-2">Estável relativamente ao mês anterior</p>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                        Avaliação Automática de Mercado <Zap className="w-6 h-6 text-blue-400" />
                                    </h3>
                                    <p className="text-gray-400 mb-8 max-w-xl font-medium">Insira os dados do seu imóvel e receba uma estimativa de preço baseada em inteligência artificial e dados reais de mercado.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <select className="bg-white/10 p-4 rounded-xl border border-white/20 outline-none focus:bg-white/20">
                                            <option>Talatona</option>
                                            <option>Kilamba</option>
                                            <option>Islandia</option>
                                        </select>
                                        <select className="bg-white/10 p-4 rounded-xl border border-white/20 outline-none focus:bg-white/20">
                                            <option>Apartamento</option>
                                            <option>Vivenda</option>
                                        </select>
                                        <input type="number" placeholder="Área m²" className="bg-white/10 p-4 rounded-xl border border-white/20 outline-none focus:bg-white/20 placeholder:text-white/30" />
                                        <button className="bg-blue-600 px-8 py-4 rounded-xl font-black hover:bg-blue-700 transition">Estimar Preço</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'collections' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                                Minhas Coleções <Folder className="w-8 h-8 text-blue-600" />
                            </h2>
                            <button
                                onClick={() => setIsCreatingList(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                + Nova Lista
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {state.userLists.length === 0 ? (
                                <div className="col-span-full py-20 bg-gray-50 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                                    <span className="text-6xl mb-4 block">📂</span>
                                    <p className="text-gray-500 font-bold">Ainda não criou nenhuma lista personalizada.</p>
                                </div>
                            ) : (
                                state.userLists.map(list => (
                                    <div
                                        key={list.id}
                                        onClick={() => navigate(`/?list=${list.id}`)}
                                        className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                                                <Folder className="w-8 h-8" />
                                            </div>
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black">{list.listings.length} items</span>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 mb-2">{list.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-6">{list.description || 'Sem descrição'}</p>
                                        <div className="flex -space-x-3 overflow-hidden">
                                            {list.listings.slice(0, 3).map((id) => {
                                                const listing = state.listings.find(l => l.id === id);
                                                return listing ? (
                                                    <img key={id} src={listing.images[0]} className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" alt="" title={listing.title} />
                                                ) : null;
                                            })}
                                            {list.listings.length > 3 && (
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-bold text-gray-500">
                                                    +{list.listings.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create List Modal */}
            {isCreatingList && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Nova Coleção</h3>
                        <p className="text-gray-500 mb-6 font-medium">Organize os seus imóveis favoritos.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Nome da Lista</label>
                                <input
                                    value={newListName}
                                    onChange={e => setNewListName(e.target.value)}
                                    placeholder="Ex: Sonho Talatona"
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Descrição</label>
                                <textarea
                                    value={newListDesc}
                                    onChange={e => setNewListDesc(e.target.value)}
                                    placeholder="Opcional..."
                                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 font-medium resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setIsCreatingList(false);
                                    setNewListName('');
                                    setNewListDesc('');
                                }}
                                className="flex-1 py-4 font-black text-gray-500 hover:text-gray-900"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={!newListName.trim()}
                                onClick={async () => {
                                    await actions.createList(newListName, newListDesc);
                                    setIsCreatingList(false);
                                    setNewListName('');
                                    setNewListDesc('');
                                    setShowSuccessToast('Lista criada com sucesso!');
                                }}
                                className="flex-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                Criar Lista
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Protocol Modal */}
            {showSecurityModal && (
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
                            onClick={() => setShowSecurityModal(false)}
                            className="mt-10 w-full py-4 bg-white text-indigo-900 rounded-2xl font-black hover:bg-indigo-50 transition shadow-xl"
                        >
                            Entendi, Obrigado!
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL DE RECORTE DE IMAGEM */}
            {imageToCrop && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recortar Foto</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Enquadramento perfeito para o seu perfil</p>
                            </div>
                            <button
                                onClick={() => setImageToCrop(null)}
                                className="p-3 hover:bg-white rounded-2xl transition shadow-sm"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-grow relative bg-gray-900">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>

                        <div className="p-10 bg-white space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Zoom Aplicado</span>
                                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{(zoom * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setImageToCrop(null)}
                                    className="flex-1 py-5 rounded-[2rem] font-black text-gray-500 hover:bg-gray-50 transition border-2 border-transparent"
                                >
                                    Descartar
                                </button>
                                <button
                                    onClick={generateCroppedImage}
                                    className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-200 flex items-center justify-center gap-3"
                                >
                                    <Check className="w-6 h-6" /> Aplicar Recorte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[400] animate-in slide-in-from-bottom-5">
                    <div className="bg-black text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl">
                        <span>🚀</span>
                        {showSuccessToast}
                        <button
                            onClick={() => setShowSuccessToast(null)}
                            className="ml-4 text-white/50 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Face Scan Modal */}
            {showFaceScanModal && (
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
                                className={`w-full h-full object-cover grayscale transition-all duration-700 ${faceScanStep === 'success' ? 'grayscale-0 scale-110' : ''}`}
                            />

                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className={`w-full h-full border-4 border-dashed rounded-full transition-all duration-1000 ${faceScanStep === 'scanning' ? 'border-indigo-500 animate-pulse scale-105' : 'border-white/30'}`}></div>
                            </div>

                            {faceScanStep === 'scanning' && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-scan-line"></div>
                            )}

                            {faceScanStep === 'analyzing' && (
                                <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="text-center group">
                                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-white font-black text-xs uppercase tracking-widest">Analisando Pontos Faciais...</p>
                                    </div>
                                </div>
                            )}

                            {faceScanStep === 'success' && (
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
                            {faceScanStep === 'idle' && (
                                <button
                                    onClick={handleFaceScan}
                                    className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3"
                                >
                                    Começar Mapeamento
                                </button>
                            )}

                            <button
                                onClick={stopFaceScan}
                                className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition"
                            >
                                Cancelar Processo
                            </button>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>
                    </div>
                </div>
            )}

            {/* Hidden Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e)}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
            />
            <input
                type="file"
                ref={verificationInputRef}
                onChange={(e) => handleFileUpload(e)}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
            />
            <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
};

export default DashboardPage;
