
import React, { useState } from 'react';
import { User, Listing, ListingCategory, TransactionType, ListingStatus } from '../types';

interface CreateListingProps {
    currentUser: User;
    onAddListing: (listing: Listing) => void;
    onBack: () => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ currentUser, onAddListing, onBack }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: ListingCategory.HOUSE,
        transactionType: TransactionType.RENT,
        neighborhood: '',
        city: 'Luanda',
        features: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newListing: Listing = {
            id: Date.now().toString(),
            ownerId: currentUser.id,
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            currency: 'AOA',
            category: formData.category,
            transactionType: formData.transactionType,
            status: ListingStatus.AVAILABLE,
            images: ['https://picsum.photos/seed/' + Date.now() + '/800/600'],
            location: {
                city: formData.city,
                neighborhood: formData.neighborhood,
                coords: [-8.81, 13.23]
            },
            views: 0,
            createdAt: new Date().toISOString(),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
        };

        onAddListing(newListing);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <button onClick={onBack} className="text-gray-500 hover:text-blue-600 mb-6 flex items-center">
                ← Cancelar
            </button>

            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Novo Anúncio</h1>
                <p className="text-gray-500 mb-10">Preencha os detalhes do seu imóvel ou viatura.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Título do Anúncio</label>
                        <input
                            required
                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition"
                            placeholder="Ex: Vivenda T4 no Condomínio Jardim de Rosas"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Categoria</label>
                            <select
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value as ListingCategory })}
                            >
                                {Object.values(ListingCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Tipo de Transação</label>
                            <select
                                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition"
                                value={formData.transactionType}
                                onChange={e => setFormData({ ...formData, transactionType: e.target.value as TransactionType })}
                            >
                                <option value={TransactionType.RENT}>Arrendar</option>
                                <option value={TransactionType.BUY}>Vender</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Preço (AOA)</label>
                        <input
                            required
                            type="number"
                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Localização (Bairro)</label>
                        <input
                            required
                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition"
                            placeholder="Ex: Talatona"
                            value={formData.neighborhood}
                            onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Descrição Detalhada</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition"
                            placeholder="Fale sobre o estado, áreas, comodidades..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 hover:shadow-blue-200 transition-all uppercase tracking-widest"
                    >
                        Publicar Anúncio
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
