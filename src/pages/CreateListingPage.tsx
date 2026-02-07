
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Listing, ListingCategory, TransactionType, ListingStatus } from '../types';
import { CITIES, VALIDATION } from '../constants';

const CreateListingPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

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

    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;
        if (!state.user) return;

        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newListing: Listing = {
            id: `l_${Date.now()}`,
            ownerId: state.user.id,
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
            views: 0,
            createdAt: new Date().toISOString(),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
        };

        actions.addListing(newListing);
        navigate('/dashboard');
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-blue-600 mb-6 flex items-center font-medium"
            >
                ← Cancelar
            </button>

            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-10">
                    {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm transition ${currentStep >= step
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`h-1 w-16 mx-2 rounded transition ${currentStep > step ? 'bg-blue-600' : 'bg-gray-100'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-gray-900">Informações Básicas</h1>
                                <p className="text-gray-500">Descreva o seu anúncio</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    Título do Anúncio *
                                </label>
                                <input
                                    className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.title ? 'border-red-300' : 'border-transparent'} focus:border-blue-500 focus:bg-white outline-none transition`}
                                    placeholder="Ex: Vivenda T4 no Condomínio Jardim de Rosas"
                                    value={formData.title}
                                    onChange={e => updateField('title', e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                        Categoria *
                                    </label>
                                    <select
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition"
                                        value={formData.category}
                                        onChange={e => updateField('category', e.target.value)}
                                    >
                                        {Object.values(ListingCategory).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                        Tipo de Transação *
                                    </label>
                                    <select
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition"
                                        value={formData.transactionType}
                                        onChange={e => updateField('transactionType', e.target.value)}
                                    >
                                        <option value={TransactionType.RENT}>Arrendar</option>
                                        <option value={TransactionType.BUY}>Vender</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    Descrição Detalhada *
                                </label>
                                <textarea
                                    rows={5}
                                    className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.description ? 'border-red-300' : 'border-transparent'} focus:border-blue-500 focus:bg-white outline-none transition resize-none`}
                                    placeholder="Descreva o estado, áreas, comodidades, proximidade a serviços..."
                                    value={formData.description}
                                    onChange={e => updateField('description', e.target.value)}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                <p className="text-xs text-gray-400 mt-1">{formData.description.length} / {VALIDATION.DESCRIPTION_MIN_LENGTH} min</p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location & Price */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-gray-900">Localização e Preço</h1>
                                <p className="text-gray-500">Onde está e quanto custa</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    Preço (AOA) *
                                </label>
                                <input
                                    type="number"
                                    className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.price ? 'border-red-300' : 'border-transparent'} focus:border-blue-500 focus:bg-white outline-none transition text-2xl font-bold`}
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={e => updateField('price', e.target.value)}
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                        Cidade *
                                    </label>
                                    <select
                                        className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition"
                                        value={formData.city}
                                        onChange={e => updateField('city', e.target.value)}
                                    >
                                        {CITIES.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                        Bairro *
                                    </label>
                                    <input
                                        className={`w-full p-4 bg-gray-50 rounded-2xl border-2 ${errors.neighborhood ? 'border-red-300' : 'border-transparent'} focus:border-blue-500 focus:bg-white outline-none transition`}
                                        placeholder="Ex: Talatona"
                                        value={formData.neighborhood}
                                        onChange={e => updateField('neighborhood', e.target.value)}
                                    />
                                    {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Features & Review */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-gray-900">Características</h1>
                                <p className="text-gray-500">Adicione os detalhes finais</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                                    Características (separadas por vírgula)
                                </label>
                                <input
                                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition"
                                    placeholder="Ex: Piscina, Segurança 24h, AC, Garagem"
                                    value={formData.features}
                                    onChange={e => updateField('features', e.target.value)}
                                />
                            </div>

                            {/* Preview */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Resumo do Anúncio</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Título:</span> <span className="font-medium">{formData.title}</span></p>
                                    <p><span className="text-gray-500">Categoria:</span> <span className="font-medium">{formData.category}</span></p>
                                    <p><span className="text-gray-500">Tipo:</span> <span className="font-medium">{formData.transactionType === TransactionType.RENT ? 'Arrendamento' : 'Venda'}</span></p>
                                    <p><span className="text-gray-500">Preço:</span> <span className="font-bold text-blue-700">{Number(formData.price).toLocaleString()} AOA</span></p>
                                    <p><span className="text-gray-500">Local:</span> <span className="font-medium">{formData.neighborhood}, {formData.city}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-10 pt-6 border-t">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900"
                            >
                                ← Anterior
                            </button>
                        ) : <div />}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                Continuar →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'A publicar...' : '🚀 Publicar Anúncio'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListingPage;
