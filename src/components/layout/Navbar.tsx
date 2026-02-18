
import React from 'react';
import { User, Notification, Message } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { USE_MOCK } from '../../services/api';
import { MessageSquare, Bell, LogOut, PlusCircle } from 'lucide-react';

interface NavbarProps {
    onNavigate: (page: string) => void;
    currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
    const { state, actions } = useApp();
    const { user, notifications, messages } = state;

    const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id).length;

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm flex flex-col">
            {USE_MOCK && (
                <div className="bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold text-center py-1 border-b border-yellow-200">
                    ⚠️ Modo Demonstração (Sem Base de Dados) — Configure .env para persistir dados
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <button
                            className="flex-shrink-0 flex items-center"
                            onClick={() => onNavigate('home')}
                        >
                            <span className="text-2xl font-black text-blue-700 tracking-tight">FACIL</span>
                            <span className="ml-2 text-[10px] font-black px-2 py-0.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hidden sm:block uppercase tracking-widest">
                                Angola
                            </span>
                        </button>

                        {/* Main Navigation */}
                        <nav className="hidden sm:ml-8 sm:flex sm:space-x-1" role="navigation" aria-label="Main">
                            <NavLink
                                active={currentPage === 'home'}
                                onClick={() => onNavigate('home')}
                            >
                                Início
                            </NavLink>
                            <NavLink
                                active={currentPage === 'categories'}
                                onClick={() => onNavigate('categories')}
                            >
                                Categorias
                            </NavLink>
                            {user && user.role !== 'CLIENT' && (
                                <NavLink
                                    active={currentPage === 'create'}
                                    onClick={() => onNavigate('create')}
                                >
                                    <span className="text-blue-600 flex items-center gap-1.5">
                                        <PlusCircle className="w-4 h-4" /> Publicar
                                    </span>
                                </NavLink>
                            )}
                        </nav>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2">
                        {user ? (
                            <>
                                {/* Messages */}
                                <IconButton
                                    icon={<MessageSquare className="w-5 h-5" />}
                                    onClick={() => onNavigate('inbox')}
                                    aria-label="Mensagens"
                                />

                                {/* Notifications */}
                                <div className="relative">
                                    <IconButton
                                        icon={<Bell className="w-5 h-5" />}
                                        badge={unreadNotifications}
                                        onClick={() => {
                                            onNavigate('dashboard');
                                            actions.markNotificationsRead();
                                        }}
                                        aria-label="Notificações"
                                    />
                                </div>

                                {/* User Menu */}
                                <button
                                    className="flex items-center ml-2 p-1 rounded-full hover:bg-gray-100 transition"
                                    onClick={() => onNavigate(user.role === 'ADMIN' ? 'admin_dashboard' : 'dashboard')}
                                >
                                    <img
                                        className="h-9 w-9 rounded-full border-2 border-blue-500 p-0.5"
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                    <span className="ml-2 text-sm font-semibold text-gray-700 hidden md:block">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={actions.logout}
                                    className="ml-2 p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                                    title="Sair"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => onNavigate('auth')}
                                    className="text-gray-600 hover:text-gray-900 text-sm font-semibold"
                                >
                                    Entrar
                                </button>
                                <button
                                    onClick={() => onNavigate('auth')}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    Criar Conta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// ============ SUB-COMPONENTS ============

interface NavLinkProps {
    children?: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition ${active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
    >
        {children}
    </button>
);

interface IconButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    badge?: number;
    'aria-label': string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, badge, ...props }) => (
    <button
        onClick={onClick}
        className="relative p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
        {...props}
    >
        {icon}
        {badge !== undefined && badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </button>
);
