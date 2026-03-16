
import { useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useListings } from '../../../contexts/ListingsContext';
import { useMessaging } from '../../../contexts/MessagingContext';
import { useAccount } from '../../../contexts/AccountContext';
import { UserDocument } from '../../../shared/types';

export const useDashboard = () => {
    const { user, actions: authActions } = useAuth();
    const { listings, actions: listingActions } = useListings();
    const { messages } = useMessaging();
    const { 
        appointments, userLists, userDocuments: documents, 
        searchHistory, searchAlerts,
        actions: accountActions 
    } = useAccount();

    const [activeTab, setActiveTab] = useState<'activity' | 'listings' | 'documents' | 'appointments' | 'collections' | 'comparison' | 'market' | 'verification'>('activity');

    // UI Local States
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
    const [uploadingType, setUploadingType] = useState<'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS' | 'OTHER' | null>(null);
    const [showFaceScanModal, setShowFaceScanModal] = useState(false);
    const [faceScanStep, setFaceScanStep] = useState<'idle' | 'scanning' | 'analyzing' | 'success'>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Cropper States
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const verificationInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const userListings = listings.filter(l => l.ownerId === user?.id);
    const userDocuments = documents.filter(d => d.userId === user?.id);
    const userMessages = messages.filter(m =>
        m.receiverId === user?.id || m.senderId === user?.id
    );
    const favoriteListings = listings.filter(l => user?.favorites?.includes(l.id));

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, customType?: 'ID_CARD' | 'TAX_ID' | 'PROOF_ADDRESS' | 'OTHER') => {
        const file = event.target.files?.[0];
        const docType = customType || uploadingType || 'OTHER';

        if (file && user) {
            const newDoc: UserDocument = {
                id: Date.now().toString(),
                userId: user.id,
                type: docType as any,
                url: URL.createObjectURL(file),
                status: 'PENDING',
                createdAt: new Date().toISOString()
            };
            accountActions.addDocument(newDoc);

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
                image, croppedAreaPixels.x, croppedAreaPixels.y,
                croppedAreaPixels.width, croppedAreaPixels.height,
                0, 0, croppedAreaPixels.width, croppedAreaPixels.height
            );
            const croppedImageUrl = canvas.toDataURL('image/jpeg');
            authActions.updateAvatar(croppedImageUrl);
            setImageToCrop(null);
            setShowSuccessToast('Foto de perfil recortada e atualizada!');
        } catch (e) {
            console.error(e);
        }
    };

    return {
        user,
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
        onCropComplete: (area: any, pixels: any) => setCroppedAreaPixels(pixels),
        generateCroppedImage,
        userListings, userDocuments, userMessages, favoriteListings,
        appointments, userLists, searchHistory, searchAlerts, listings,
        handleFileUpload, triggerVerificationUpload, startFaceScan, stopFaceScan, handleAvatarUpload,
        actions: { 
            createList: accountActions.createList,
            logout: authActions.logout
        }
    };
};
