import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole, ListingCategory, TransactionType } from '../../types';

export const DatabaseSeeder: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [adminPassword, setAdminPassword] = useState('');

    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const users = [
        {
            email: 'admin@facil.ao',
            password: adminPassword || 'Admin123!',
            role: 'ADMIN',
            name: 'Administrador FÁCIL',
            isVerified: true,
            avatar: 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png'
        },
        {
            email: 'imobiliaria@luanda.ao',
            password: 'Password123!',
            role: 'OWNER',
            name: 'Imobiliária Silva & Filhos',
            companyName: 'Silva Properties Lda',
            nif: '5412312312',
            address: 'Talatona, Via S8',
            phone: '+244 923 456 789',
            isVerified: true,
            rating: 4.8,
            reviewCount: 42,
            avatar: 'https://cdn-icons-png.flaticon.com/512/4300/4300058.png'
        },
        {
            email: 'joao.cliente@gmail.com',
            password: 'Password123!',
            role: 'CLIENT',
            name: 'João Baptista',
            isVerified: true,
            avatar: 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'
        }
    ];

    const sampleListings = [
        {
            title: 'Apartamento T3 no Kilamba',
            description: 'Excelente apartamento com vista para a cidade, cozinha equipada, ar condicionado em todos os quartos. Condomínio fechado com segurança 24h.',
            price: 150000,
            currency: 'AOA',
            transactionType: 'RENT',
            city: 'Luanda',
            neighborhood: 'Kilamba',
            category: 'APARTMENT',
            features: ['Ar Condicionado', 'Segurança 24h', 'Estacionamento', 'Elevador', 'Varanda'],
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1484154218962-a1c00207bf9a?auto=format&fit=crop&w=1000&q=80'
            ],
            status: 'AVAILABLE',
            isFeatured: true
        },
        {
            title: 'Vivenda V4 em Talatona',
            description: 'Vivenda de luxo com piscina, jardim, gerador próprio e anexo. Próximo ao Belas Shopping.',
            price: 85000000,
            currency: 'AOA',
            transactionType: 'SALE',
            city: 'Luanda',
            neighborhood: 'Talatona',
            category: 'HOUSE',
            features: ['Piscina', 'Jardim', 'Gerador', 'Anexo', 'Garagem Dupla', 'Suite Master'],
            images: [
                'https://images.unsplash.com/photo-1600596542815-2495db9a12a6?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
            ],
            status: 'AVAILABLE',
            isFeatured: true
        },
        {
            title: 'Terreno 20x30 no Benfica',
            description: 'Terreno plano, murado, com documentação em dia (Direito de Superfície). Ótimo para construção residencial.',
            price: 12000000,
            currency: 'AOA',
            transactionType: 'SALE',
            city: 'Luanda',
            neighborhood: 'Benfica',
            category: 'LAND',
            features: ['Murado', 'Documentação Legal', 'Água e Luz na zona'],
            images: [
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
            ],
            status: 'AVAILABLE',
            isFeatured: false
        }
    ];

    const runSeed = async () => {
        setStatus('loading');
        setLogs([]);
        addLog('Iniciando processo de seed...');

        try {
            // 1. Create Users
            const userMap: Record<string, string> = {};

            for (const user of users) {
                addLog(`Criando utilizador: ${user.email} (${user.role})...`);

                // Try creating auth user
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: user.email,
                    password: user.password,
                    options: {
                        data: {
                            name: user.name,
                            role: user.role,
                            phone: 'phone' in user ? user.phone : undefined,
                            nif: 'nif' in user ? user.nif : undefined,
                            company_name: 'companyName' in user ? user.companyName : undefined,
                            address: 'address' in user ? user.address : undefined,
                        }
                    }
                });

                if (authError) {
                    addLog(`⚠️ Erro ao criar auth: ${authError.message}. Tentando login...`);
                    // If exists, try login to get ID
                    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                        email: user.email,
                        password: user.password
                    });

                    if (loginError || !loginData.user) {
                        throw new Error(`Falha crítica ao obter utilizador ${user.email}: ${loginError?.message}`);
                    }

                    userMap[user.role] = loginData.user.id;
                    addLog(`✅ Utilizador recuperado: ${loginData.user.id}`);
                } else if (authData.user) {
                    userMap[user.role] = authData.user.id;
                    addLog(`✅ Utilizador criado: ${authData.user.id}`);
                }

                // Update Profile with extra data manually just in case trigger missed something or we logged in
                if (userMap[user.role]) {
                    const { error: profileError } = await supabase.from('profiles').upsert({
                        id: userMap[user.role],
                        name: user.name,
                        email: user.email,
                        role: user.role as any,
                        is_verified: user.isVerified,
                        rating: 'rating' in user ? user.rating : 0,
                        review_count: 'reviewCount' in user ? user.reviewCount : 0,
                        avatar_url: user.avatar,
                        // Owner specific
                        company_name: 'companyName' in user ? user.companyName : null,
                        nif: 'nif' in user ? user.nif : null
                    } as any);

                    if (profileError) addLog(`⚠️ Aviso perfil: ${profileError.message}`);
                }
            }

            // 2. Create Listings (for owner)
            const ownerId = userMap['OWNER'];
            if (ownerId) {
                addLog('Criando anúncios para o proprietário...');

                for (const listing of sampleListings) {
                    const { error: listingError } = await supabase.from('listings').insert({
                        owner_id: ownerId,
                        title: listing.title,
                        description: listing.description,
                        price: listing.price,
                        currency: listing.currency,
                        transaction_type: listing.transactionType,
                        category: listing.category,
                        city: listing.city,
                        neighborhood: listing.neighborhood,
                        features: listing.features,
                        images: listing.images,
                        status: listing.status,
                        is_featured: listing.isFeatured
                    } as any);

                    if (listingError) addLog(`❌ Erro anúncio "${listing.title}": ${listingError.message}`);
                    else addLog(`✅ Anúncio criado: "${listing.title}"`);
                }
            } else {
                addLog('⚠️ Pulando anúncios: Proprietário não encontrado.');
            }

            setStatus('success');
            addLog('🎉 Processo finalizado com sucesso! Agora você pode fazer login.');

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            addLog(`❌ Erro fatal: ${err.message}`);
            if (err.message.includes('Database error')) {
                addLog('💡 DICA: Isso geralmente significa que você não criou a tabela "profiles" no Supabase.');
                addLog('👉 Copie o SQL abaixo e rode no SQL Editor do Supabase.');
            }
        }
    };

    const sqlSnippet = `
-- CRIE AS TABELAS NO SUPABASE SQL EDITOR
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT, email TEXT, role TEXT, phone TEXT, 
  nif TEXT, company_name TEXT, address TEXT, 
  avatar_url TEXT, bio TEXT, is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 0, review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Self insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- TRIGGER PARA NOVO USUÁRIO
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Configuração Inicial</h1>
                        <p className="text-gray-500 mt-2">1. Crie as tabelas (SQL) ➡️ 2. Inicie a Configuração (Seed)</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                        <span className="text-xs font-bold text-blue-700 uppercase">Status: {status}</span>
                    </div>
                </div>

                {/* SQL Section */}
                <div className="bg-amber-50 p-6 rounded-2xl mb-8 border border-amber-200">
                    <h3 className="font-bold text-amber-800 mb-2 flex items-center">
                        <span className="mr-2">⚡</span> Passo Obrigatório: Criar Tabelas
                    </h3>
                    <p className="text-sm text-amber-700 mb-4">
                        O botão automático abaixo só funcionará SE as tabelas já existirem no banco.
                        Copie o código abaixo e execute no <b>SQL Editor</b> do seu painel Supabase.
                    </p>
                    <div className="relative">
                        <pre className="bg-white p-4 rounded-xl text-xs font-mono overflow-x-auto border border-amber-100 text-gray-600 max-h-40">
                            {sqlSnippet}
                        </pre>
                        <button
                            onClick={() => navigator.clipboard.writeText(sqlSnippet)}
                            className="absolute top-2 right-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs px-3 py-1 rounded font-bold transition"
                        >
                            Copiar SQL
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">

                    <h3 className="font-bold text-gray-700 mb-4">Credenciais que serão criadas:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {users.map((u, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`h-2 w-2 rounded-full ${u.role === 'ADMIN' ? 'bg-red-500' : u.role === 'OWNER' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                    <span className="font-bold text-xs uppercase text-gray-400">{u.role}</span>
                                </div>
                                <p className="font-mono text-sm font-bold text-gray-800">{u.email}</p>
                                <p className="text-xs text-gray-400 mt-1">Pass: {u.role === 'ADMIN' && !adminPassword ? 'Definir Abaixo' : u.password}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Senha do Admin (Segurança)</label>
                    <input
                        type="text"
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        placeholder="Defina uma senha forte ou use o padrão (Admin123!)"
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <button
                    onClick={runSeed}
                    disabled={status === 'loading'}
                    className={`w-full py-4 text-white font-bold rounded-2xl text-lg shadow-lg transition-all ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        }`}
                >
                    {status === 'loading' ? 'A Configurar...' : '🚀 Iniciar Configuração Automática'}
                </button>

                {logs.length > 0 && (
                    <div className="mt-8 bg-gray-900 rounded-2xl p-6 font-mono text-xs text-green-400 overflow-y-auto max-h-60 shadow-inner">
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
