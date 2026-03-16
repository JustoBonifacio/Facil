
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/config';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-8xl font-black text-slate-200 mb-4 animate-pulse">404</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Página não encontrada</h1>
                <p className="text-slate-500 mb-8">A página que procura não existe ou foi movida.</p>
                <button
                    onClick={() => navigate(ROUTES.HOME)}
                    className="bg-facil-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:scale-95 transform hover:-translate-y-1"
                >
                    Voltar ao Início
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
