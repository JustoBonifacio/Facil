
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import {
    Zap, Home, Heart, Scale, Calendar, LineChart, FileText,
    BadgeCheck, MessageSquare, Star
} from 'lucide-react';

// Specialized Components
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { DashboardTabs } from '../features/dashboard/components/DashboardTabs';
import { ActivityTab } from '../features/dashboard/components/ActivityTab';
import { ListingsTab } from '../features/dashboard/components/ListingsTab';
import { AppointmentsTab } from '../features/dashboard/components/AppointmentsTab';
import { DocumentsTab } from '../features/dashboard/components/DocumentsTab';
import { VerificationTab } from '../features/dashboard/components/VerificationTab';
import { ComparisonTab } from '../features/dashboard/components/ComparisonTab';
import { MarketTab } from '../features/dashboard/components/MarketTab';
import { CollectionsTab } from '../features/dashboard/components/CollectionsTab';

// Modals & Toast
import { CreateListModal } from '../features/dashboard/components/CreateListModal';
import { SecurityModal } from '../features/dashboard/components/SecurityModal';
import { FaceScanModal } from '../features/dashboard/components/FaceScanModal';
import { ImageCropperModal } from '../features/dashboard/components/ImageCropperModal';
import { SuccessToast } from '../features/dashboard/components/SuccessToast';

const DashboardPage = () => {
    const navigate = useNavigate();
    const {
        user, appointments, userLists, searchHistory, searchAlerts, listings,
        actions,
        activeTab, setActiveTab,
        isCreatingList, setIsCreatingList,
        showSecurityModal, setShowSecurityModal,
        showSuccessToast, setShowSuccessToast,
        showFaceScanModal, setShowFaceScanModal,
        faceScanStep, handleFaceScan,
        videoRef, fileInputRef, verificationInputRef, avatarInputRef,
        imageToCrop, setImageToCrop,
        crop, setCrop,
        zoom, setZoom,
        onCropComplete,
        generateCroppedImage,
        userListings, userDocuments, userMessages, favoriteListings,
        handleFileUpload, triggerVerificationUpload, startFaceScan, stopFaceScan, handleAvatarUpload
    } = useDashboard();

    if (!user) return null;

    const stats = [
        { label: 'Favoritos', value: favoriteListings.length, icon: <Heart className="w-5 h-5" /> },
        ...(user.role !== 'CLIENT' ? [{ label: 'Meus Anúncios', value: userListings.length, icon: <Home className="w-5 h-5" /> }] : []),
        { label: 'Mensagens', value: userMessages.length, icon: <MessageSquare className="w-5 h-5" /> },
        { label: 'Avaliação', value: user.rating.toFixed(1), icon: <Star className="w-5 h-5" /> },
    ];

    const tabs = [
        { id: 'activity', label: 'Minha Atividade', icon: <Zap className="w-5 h-5" /> },
        ...(user.role !== 'CLIENT' ? [{ id: 'listings', label: 'Gerir Anúncios', icon: <Home className="w-5 h-5" /> }] : []),
        { id: 'collections', label: 'Coleções', icon: <Heart className="w-5 h-5" /> },
        { id: 'comparison', label: 'Comparar', icon: <Scale className="w-5 h-5" /> },
        { id: 'appointments', label: 'Agenda', icon: <Calendar className="w-5 h-5" /> },
        { id: 'market', label: 'Mercado', icon: <LineChart className="w-5 h-5" /> },
        { id: 'documents', label: 'Cofre Digital', icon: <FileText className="w-5 h-5" /> },
        { id: 'verification', label: 'Verificação', icon: <BadgeCheck className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DashboardHeader
                user={user}
                stats={stats}
                onAvatarClick={() => avatarInputRef.current?.click()}
                onCreateListing={() => navigate('/create')}
                onGodMode={() => navigate('/god-mode')}
            />

            <DashboardTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as any)}
            />

            <div className="mt-8">
                {activeTab === 'activity' && (
                    <ActivityTab
                        favoriteListings={favoriteListings}
                        searchAlerts={searchAlerts}
                        searchHistory={searchHistory}
                        recentListings={listings.slice(0, 5)}
                        onNavigateToListing={(id) => navigate(`/listing/${id}`)}
                        onViewCollections={() => setActiveTab('collections')}
                        onAddAlert={() => setShowSuccessToast('Funcionalidade de alerta inteligente ativada!')}
                        onRepeatSearch={(query) => navigate(`/?query=${query}`)}
                    />
                )}

                {activeTab === 'listings' && (
                    <ListingsTab
                        listings={userListings}
                        onListingClick={(id) => navigate(`/listing/${id}`)}
                        onCreateListing={() => navigate('/create')}
                    />
                )}

                {activeTab === 'appointments' && (
                    <AppointmentsTab
                        appointments={appointments}
                        listings={listings}
                        onListingClick={(id) => navigate(`/listing/${id}`)}
                        onSyncCalendar={() => setShowSuccessToast('Detalhes do agendamento sincronizados com Google Calendar.')}
                        onShowSecurityProtocol={() => setShowSecurityModal(true)}
                    />
                )}

                {activeTab === 'documents' && (
                    <DocumentsTab
                        documents={userDocuments}
                        onUploadClick={() => fileInputRef.current?.click()}
                        onViewDocument={(url) => window.open(url, '_blank')}
                        onActivateSignature={() => setShowSuccessToast('Certificado de Assinatura Digital emitido com sucesso!')}
                    />
                )}

                {activeTab === 'verification' && (
                    <VerificationTab
                        user={user}
                        documents={userDocuments}
                        onUploadVerify={triggerVerificationUpload}
                        onStartFaceScan={startFaceScan}
                    />
                )}

                {activeTab === 'comparison' && (
                    <ComparisonTab
                        favoriteListings={favoriteListings}
                        onNavigateToListing={(id) => navigate(`/listing/${id}`)}
                        onExplore={() => navigate('/')}
                    />
                )}

                {activeTab === 'market' && <MarketTab />}

                {activeTab === 'collections' && (
                    <CollectionsTab
                        userLists={userLists}
                        listings={listings}
                        onNavigateToList={(id) => navigate(`/?list=${id}`)}
                        onCreateList={() => setIsCreatingList(true)}
                    />
                )}
            </div>

            {/* Modals */}
            {isCreatingList && (
                <CreateListModal
                    onClose={() => setIsCreatingList(false)}
                    onCreate={async (name, desc) => {
                        await actions.createList(name, desc);
                        setIsCreatingList(false);
                        setShowSuccessToast('Lista criada com sucesso!');
                    }}
                />
            )}

            {showSecurityModal && <SecurityModal onClose={() => setShowSecurityModal(false)} />}

            {showFaceScanModal && (
                <FaceScanModal
                    step={faceScanStep}
                    videoRef={videoRef}
                    onStartScan={handleFaceScan}
                    onClose={stopFaceScan}
                />
            )}

            {imageToCrop && (
                <ImageCropperModal
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    onClose={() => setImageToCrop(null)}
                    onApply={generateCroppedImage}
                />
            )}

            {showSuccessToast && (
                <SuccessToast
                    message={showSuccessToast}
                    onClose={() => setShowSuccessToast(null)}
                />
            )}

            {/* Hidden Inputs for File Uploads */}
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e)} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
            <input type="file" ref={verificationInputRef} onChange={(e) => handleFileUpload(e)} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
            <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
        </div>
    );
};

export default DashboardPage;
