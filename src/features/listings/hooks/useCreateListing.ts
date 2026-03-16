
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useListings } from '../../../contexts/ListingsContext';
import { Listing, ListingCategory, TransactionType, ListingStatus } from '../../../shared/types';
import { VALIDATION } from '../../../constants';

export const useCreateListing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { actions } = useListings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: ListingCategory.HOUSE,
        transactionType: TransactionType.RENT,
        neighborhood: '',
        city: 'Luanda',
        features: '',
    });

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};
        if (step === 1) {
            if (!formData.title || formData.title.length < VALIDATION.TITLE_MIN_LENGTH) {
                newErrors.title = `Título deve ter pelo menos ${VALIDATION.TITLE_MIN_LENGTH} caracteres`;
            }
            if (!formData.description || formData.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH) {
                newErrors.description = `Descrição deve ter pelo menos ${VALIDATION.DESCRIPTION_MIN_LENGTH} caracteres`;
            }
        }
        if (step === 2) {
            if (!formData.price || Number(formData.price) < VALIDATION.MIN_PRICE) {
                newErrors.price = `Preço mínimo é ${VALIDATION.MIN_PRICE.toLocaleString()} AOA`;
            }
            if (!formData.neighborhood) {
                newErrors.neighborhood = 'Bairro é obrigatório';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        if (!user) return;
        setIsSubmitting(true);
        
        try {
            await actions.addListing({
                ownerId: user.id,
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                currency: 'AOA',
                category: formData.category,
                transactionType: formData.transactionType,
                status: ListingStatus.AVAILABLE,
                images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
                location: {
                    city: formData.city,
                    neighborhood: formData.neighborhood,
                    coords: [-8.81, 13.23],
                },
                features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to create listing', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return {
        formData, errors, currentStep, isSubmitting,
        handleNext, handleBack, handleSubmit, updateField,
        user
    };
};
