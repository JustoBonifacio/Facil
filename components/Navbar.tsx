
import React from 'react';
import { User, Notification, Message } from '../types';

interface NavbarProps {
  user: User | null;
  notifications: Notification[];
  messages: Message[];
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onMarkAsRead: (id: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  notifications, 
  messages, 
  onLogout, 
  onNavigate, 
  onMarkAsRead,
  currentPage 
}) => {
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => onNavigate('home')}
            >
              <span className="text-2xl font-bold text-blue-700 tracking-tight">FACIL</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full hidden sm:block">ANGOLA</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <button 
                onClick={() => onNavigate('home')}
                className={`${currentPage === 'home' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Início
              </button>
              <button 
                onClick={() => onNavigate('categories')}
                className={`${currentPage === 'categories' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Categorias
              </button>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate('inbox')}
                  className="p-2 text-gray-400 hover:text-blue-600 relative"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
                <div className="relative">
                   <button className="p-2 text-gray-400 hover:text-blue-600 relative">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex items-center ml-4 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                  <img
                    className="h-8 w-8 rounded-full border-2 border-blue-500"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate('auth')}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => onNavigate('auth')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
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

export default Navbar;
