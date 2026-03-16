import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../contexts/MessagingContext';
import { USE_MOCK } from '../../services/config';
import { MessageSquare, Bell, LogOut, PlusCircle, User as UserIcon, Phone, Home as HomeIcon, AlertCircle } from 'lucide-react';

interface NavbarProps {
    onNavigate: (page: string) => void;
    currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
    const { user, actions: authActions } = useAuth();
    const { notifications } = useMessaging();
    const [isScrolled, setIsScrolled] = useState(false);

    const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id).length;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClass = isScrolled
        ? "bg-white shadow-md py-2"
        : "bg-transparent py-4 text-white";

    const linkClass = isScrolled
        ? "text-facil-dark hover:text-facil-blue"
        : "text-white hover:text-facil-blue";

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
            {USE_MOCK && !isScrolled && (
                <div className="bg-yellow-100/20 text-yellow-100 text-[9px] uppercase font-bold text-center py-1 backdrop-blur-sm flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Modo Demonstração
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <button
                            className="flex items-center gap-2 group"
                            onClick={() => onNavigate('home')}
                        >
                            <div className={`p-1.5 rounded-xl transition-all duration-300 group-hover:scale-110 ${isScrolled ? 'bg-facil-blue text-white' : 'bg-white text-facil-blue'}`}>
                                <HomeIcon className="w-5 h-5" />
                            </div>
                            <span className={`text-2xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-facil-dark' : 'text-white'}`}>
                                Fácil
                            </span>
                        </button>
                    </div>

                    {/* Main Navigation (Center) */}
                    <div className="hidden lg:flex items-center justify-center flex-grow space-x-2">
                        <NavLink scrolled={isScrolled} active={currentPage === 'home'} onClick={() => onNavigate('home')}>Início</NavLink>
                        <NavLink scrolled={isScrolled} active={currentPage === 'categories'} onClick={() => onNavigate('categories')}>Propriedades</NavLink>
                        <NavLink scrolled={isScrolled} active={false} onClick={() => onNavigate('categories')}>Categorias</NavLink>
                        <NavLink scrolled={isScrolled} active={false} onClick={() => onNavigate('home')}>Agentes</NavLink>
                        <NavLink scrolled={isScrolled} active={false} onClick={() => onNavigate('home')}>Sobre</NavLink>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-5">
                        <div className={`hidden md:flex items-center gap-2 font-semibold ${linkClass}`}>
                            <div className="animate-icon-bounce">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-sm">(800) 987 6543</span>
                        </div>

                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="animate-icon-pulse">
                                    <IconButton
                                        scrolled={isScrolled}
                                        icon={<Bell className="w-5 h-5" />}
                                        badge={unreadNotifications}
                                        onClick={() => onNavigate('dashboard')}
                                        aria-label="Notificações"
                                    />
                                </div>
                                <button
                                    className="flex items-center group"
                                    onClick={() => onNavigate(user.role === 'ADMIN' ? 'admin_dashboard' : 'dashboard')}
                                >
                                    <div className={`p-1.5 rounded-full border-2 transition-all ${isScrolled ? 'border-gray-200 group-hover:border-facil-blue' : 'border-white/30 group-hover:border-white'}`}>
                                        <UserIcon className={`w-5 h-5 ${isScrolled ? 'text-facil-dark' : 'text-white'}`} />
                                    </div>
                                </button>
                                 <button
                                    onClick={authActions.logout}
                                    className={`p-2 rounded-xl transition animate-icon-bounce ${isScrolled ? 'text-red-500 hover:bg-red-50' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onNavigate('auth')}
                                className={`${isScrolled ? 'text-facil-dark hover:text-facil-blue' : 'text-white hover:opacity-80'} animate-icon-pulse`}
                            >
                                <UserIcon className="w-6 h-6" />
                            </button>
                        )}

                        <button
                            onClick={() => onNavigate('create')}
                            className={`hidden sm:block px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 
                                ${isScrolled
                                    ? 'bg-facil-dark border-facil-dark text-white hover:bg-facil-blue hover:border-facil-blue hover:-translate-y-1 hover:shadow-lg'
                                    : 'bg-white/10 border-white text-white hover:bg-white hover:text-facil-dark hover:-translate-y-1 hover:shadow-lg'}`}
                        >
                            Publicar Anúncio
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

interface NavLinkComponentProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
    scrolled: boolean;
}

const NavLink: React.FC<NavLinkComponentProps> = ({ children, active, onClick, scrolled }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-[14px] font-semibold transition-all relative group
            ${scrolled
                ? (active ? 'text-facil-blue' : 'text-facil-dark hover:text-facil-blue')
                : (active ? 'text-facil-blue' : 'text-white hover:text-facil-blue')}`}
    >
        {children}
        <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-facil-blue transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 ${active ? 'scale-x-100' : ''}`}></span>
    </button>
);

interface IconButtonComponentProps {
    icon: React.ReactNode;
    onClick: () => void;
    badge?: number;
    'aria-label': string;
    scrolled: boolean;
}

const IconButton: React.FC<IconButtonComponentProps> = ({ icon, onClick, badge, scrolled, ...props }) => (
    <button
        onClick={onClick}
        className={`relative p-2 rounded-xl transition-all ${scrolled ? 'text-facil-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
        {...props}
    >
        {icon}
        {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-facil-blue text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {badge > 9 ? '9+' : badge}
            </span>
        )}
    </button>
);
