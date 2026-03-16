
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateListing } from '../features/listings/hooks/useCreateListing';
import { ListingCategory, TransactionType } from '../shared/types';
import { CITIES, VALIDATION, CATEGORY_LABELS } from '../constants';
import { ArrowLeft, Box, MapPin, Check, Plus } from 'lucide-react';

const CreateListingPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        formData, errors, currentStep, isSubmitting,
        handleNext, handleBack, handleSubmit, updateField,
        user
    } = useCreateListing();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center text-gray-500 hover:text-blue-600 mb-10 font-black uppercase tracking-widest text-[10px] transition-all"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Cancelar Criação
            </button>

            <div className="bg-white p-12 md:p-16 rounded-xl shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-facil-blue/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center mb-16 gap-4">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg transition-all shadow-lg ${currentStep >= step ? 'bg-facil-blue text-white shadow-facil-blue/20' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`h-1 w-12 mx-2 rounded-full transition-all duration-500 ${currentStep > step ? 'bg-facil-blue' : 'bg-slate-100'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="animate-in slide-in-from-right-10 duration-500">
                            <div className="mb-12">
                                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">O que está a vender?</h1>
                                <p className="text-gray-500 font-medium">Comece por dar um título impactante ao seu anúncio.</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Título Profissional *</label>
                                    <input
                                        className={`w-full p-6 bg-slate-50 rounded-xl border-2 font-bold text-lg outline-none transition-all placeholder:text-slate-300 ${errors.title ? 'border-rose-500 focus:border-rose-500' : 'border-transparent focus:border-facil-blue focus:bg-white focus:shadow-xl focus:shadow-facil-blue/5'
                                            }`}
                                        placeholder="Ex: Vivenda T4 Luxuosa no Talatona..."
                                        value={formData.title}
                                        onChange={e => updateField('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Categoria *</label>
                                        <select
                                            className="w-full p-6 bg-slate-50 rounded-xl border-2 border-transparent font-bold outline-none appearance-none cursor-pointer focus:border-facil-blue focus:bg-white transition-all shadow-sm hover:border-slate-200"
                                            value={formData.category}
                                            onChange={e => updateField('category', e.target.value)}
                                        >
                                            {Object.values(ListingCategory).map(cat => (
                                                <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 mt-3 pointer-events-none text-slate-400">▼</div>
                                    </div>
                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Negócio *</label>
                                        <select
                                            className="w-full p-6 bg-slate-50 rounded-xl border-2 border-transparent font-bold outline-none appearance-none cursor-pointer focus:border-facil-blue focus:bg-white transition-all shadow-sm hover:border-slate-200"
                                            value={formData.transactionType}
                                            onChange={e => updateField('transactionType', e.target.value)}
                                        >
                                            <option value={TransactionType.RENT}>Arrendar / Alugar</option>
                                            <option value={TransactionType.BUY}>Venda Directa</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 mt-3 pointer-events-none text-slate-400">▼</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Descrição Detalhada *</label>
                                    <textarea
                                        rows={6}
                                        className={`w-full p-6 bg-slate-50 rounded-xl border-2 font-medium outline-none transition-all placeholder:text-slate-300 resize-none ${errors.description ? 'border-rose-500 focus:border-rose-500' : 'border-transparent focus:border-facil-blue focus:bg-white focus:shadow-xl'
                                            }`}
                                        placeholder="Áreas, comodidades, anexos, segurança, proximidade a serviços..."
                                        value={formData.description}
                                        onChange={e => updateField('description', e.target.value)}
                                    />
                                    <div className="flex justify-between mt-2">
                                        {errors.description && <p className="text-rose-500 text-xs font-bold">{errors.description}</p>}
                                        <p className="text-[10px] text-slate-400 font-black ml-auto">{formData.description.length} caracteres</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location & Price */}
                    {currentStep === 2 && (
                        <div className="animate-in slide-in-from-right-10 duration-500">
                            <div className="mb-12">
                                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Preço e Local</h1>
                                <p className="text-gray-500 font-medium">Defina o valor de mercado e a localização exata.</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Valor Pretendido (AOA) *</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className={`w-full p-8 bg-slate-900 text-white rounded-xl font-black text-4xl outline-none focus:ring-4 focus:ring-facil-blue/20 transition-all ${errors.price ? 'ring-2 ring-rose-500' : ''
                                                }`}
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={e => updateField('price', e.target.value)}
                                        />
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl">Kz</span>
                                    </div>
                                    {errors.price && <p className="text-rose-500 text-xs mt-3 font-bold">{errors.price}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Província / Cidade *</label>
                                        <select
                                            className="w-full p-6 bg-slate-50 rounded-xl border-2 border-transparent font-bold outline-none focus:border-facil-blue focus:bg-white transition-all shadow-sm"
                                            value={formData.city}
                                            onChange={e => updateField('city', e.target.value)}
                                        >
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Bairro / Condomínio *</label>
                                        <div className="relative">
                                            <input
                                                className={`w-full p-6 pl-14 bg-slate-50 rounded-xl border-2 font-bold outline-none transition-all ${errors.neighborhood ? 'border-rose-500' : 'border-transparent focus:border-facil-blue focus:bg-white'
                                                    }`}
                                                placeholder="Ex: Talatona"
                                                value={formData.neighborhood}
                                                onChange={e => updateField('neighborhood', e.target.value)}
                                            />
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-facil-blue w-5 h-5" />
                                        </div>
                                        {errors.neighborhood && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.neighborhood}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Features & Finalization */}
                    {currentStep === 3 && (
                        <div className="animate-in slide-in-from-right-10 duration-500">
                            <div className="mb-12">
                                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Mimos e Extras</h1>
                                <p className="text-gray-500 font-medium">Destaque o que torna o seu imóvel especial.</p>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Comodidades (separadas por vírgula)</label>
                                    <input
                                        className="w-full p-6 bg-gray-50 rounded-3xl border-2 border-transparent font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                                        placeholder="Piscina, Gerador, Reservatório, Segurança 24h..."
                                        value={formData.features}
                                        onChange={e => updateField('features', e.target.value)}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {formData.features.split(',').filter(f => f.trim()).map(f => (
                                            <span key={f} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{f.trim()}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-xl text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Check className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                        <Box className="w-6 h-6 text-facil-blue" /> Resumo do Anúncio
                                    </h3>
                                    <div className="grid grid-cols-2 gap-8 text-sm font-medium">
                                        <div className="space-y-4">
                                            <p className="opacity-50 uppercase tracking-widest text-[10px] font-black">Identificação</p>
                                            <p className="text-lg">{formData.title}</p>
                                            <p className="inline-block bg-white/10 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                                                {CATEGORY_LABELS[formData.category] || formData.category}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="opacity-50 uppercase tracking-widest text-[10px] font-black">Preço & Tipo</p>
                                            <p className="text-3xl font-black text-facil-blue">{Number(formData.price).toLocaleString()} AOA</p>
                                            <p className="text-xs">{formData.transactionType === TransactionType.RENT ? 'Arrendamento Mensal' : 'Venda Directa'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-12 bg-slate-50 -mx-16 -mb-16 p-12 md:px-16 rounded-b-xl border-t border-slate-100">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all"
                            >
                                ← Voltar
                            </button>
                        ) : <div />}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-slate-900 text-white px-12 py-5 rounded-xl font-black shadow-2xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                            >
                                Continuar Explorando <ArrowLeft className="w-5 h-5 rotate-180" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-facil-blue text-white px-12 py-6 rounded-xl shadow-2xl shadow-facil-blue/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                            >
                                {isSubmitting ? 'AGUARDE...' : 'LANÇAR ANÚNCIO AGORA'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListingPage;
