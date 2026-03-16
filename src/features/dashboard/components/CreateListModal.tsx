
import React from 'react';

interface CreateListModalProps {
    onClose: () => void;
    onCreate: (name: string, desc: string) => void;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = React.useState('');
    const [desc, setDesc] = React.useState('');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Nova Coleção</h3>
                <p className="text-gray-500 mb-6 font-medium">Organize os seus imóveis favoritos.</p>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Nome da Lista</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Sonho Talatona"
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1">Descrição</label>
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="Opcional..."
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 font-medium resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 font-black text-gray-500 hover:text-gray-900"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!name.trim()}
                        onClick={() => onCreate(name, desc)}
                        className="flex-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        Criar Lista
                    </button>
                </div>
            </div>
        </div>
    );
};
