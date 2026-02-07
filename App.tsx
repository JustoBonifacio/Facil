
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Categories from './pages/Categories';
import CreateListing from './pages/CreateListing';
import Inbox from './pages/Inbox';
import GodMode from './pages/GodMode';
import ChatSystem from './components/ChatSystem';
import ContractFlow from './components/ContractFlow';
import { User, Listing, UserRole, ListingCategory, ListingStatus, Notification, Message } from './types';
import { MOCK_USERS, MOCK_LISTINGS } from './mockData';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1920');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('facil_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const syncedUser = allUsers.find(u => u.id === parsedUser.id) || parsedUser;
      setUser(syncedUser);
    }
    
    const savedMessages = localStorage.getItem('facil_messages');
    if (savedMessages) {
      setAllMessages(JSON.parse(savedMessages));
    }

    const savedBanner = localStorage.getItem('facil_banner');
    if (savedBanner) {
      setBannerUrl(savedBanner);
    }
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('facil_messages', JSON.stringify(allMessages));
  }, [allMessages]);

  useEffect(() => {
    localStorage.setItem('facil_banner', bannerUrl);
  }, [bannerUrl]);

  const handleLogin = (role: UserRole) => {
    let selectedUser;
    if (role === UserRole.ADMIN) {
      selectedUser = allUsers.find(u => u.role === UserRole.ADMIN);
    } else if (role === UserRole.OWNER) {
      selectedUser = allUsers[0];
    } else {
      selectedUser = allUsers[1];
    }
    
    if (selectedUser) {
      setUser(selectedUser);
      localStorage.setItem('facil_user', JSON.stringify(selectedUser));
      setCurrentPage(role === UserRole.ADMIN ? 'admin_dashboard' : 'home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('facil_user');
    setCurrentPage('home');
  };

  const handleListingClick = (id: string) => {
    setSelectedListingId(id);
    setCurrentPage('listing_detail');
    window.scrollTo(0, 0);
  };

  const handleAddListing = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
    setCurrentPage('dashboard');
    
    const notification: Notification = {
      id: Date.now().toString(),
      userId: user?.id || '',
      title: 'Anúncio Publicado! 🚀',
      message: `O seu anúncio "${newListing.title}" já está visível para todo o país.`,
      type: 'SUCCESS',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const handleSendMessage = (listingId: string, receiverId: string, content: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      listingId,
      senderId: user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString()
    };

    setAllMessages(prev => [...prev, newMessage]);

    if (receiverId === 'u1') {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          listingId,
          senderId: 'u1',
          receiverId: user.id,
          content: "Olá! Recebi a sua mensagem sobre este item. Quando gostaria de agendar uma visita?",
          timestamp: new Date().toISOString()
        };
        setAllMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  const handleUpdateListing = (updatedListing: Listing) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar este anúncio permanentemente?')) {
      setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user?.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem('facil_user', JSON.stringify(updatedUser));
    }
  };

  const handleVerifyUser = (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (targetUser) {
      handleUpdateUser({ ...targetUser, isVerified: true });
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        userId: userId,
        title: 'Identidade Verificada! ✅',
        message: 'A sua conta foi validada com sucesso pela nossa equipa administrativa.',
        type: 'SUCCESS',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleModerateListing = (listingId: string, status: ListingStatus) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status } : l));
  };

  const handleCategoryClick = (cat: ListingCategory) => {
    setCurrentPage('home');
    setTimeout(() => {
       window.scrollTo({ top: 600, behavior: 'smooth' });
    }, 100);
  };

  const activeListing = listings.find(l => l.id === selectedListingId);
  const activeListingOwner = activeListing ? allUsers.find(u => u.id === activeListing.ownerId) : null;
  const userNotifications = user ? notifications.filter(n => n.userId === user.id) : [];
  
  const activeChatMessages = (user && activeListing && activeListingOwner) 
    ? allMessages.filter(m => m.listingId === activeListing.id && (
        (m.senderId === user.id && m.receiverId === activeListingOwner.id) ||
        (m.senderId === activeListingOwner.id && m.receiverId === user.id)
      ))
    : [];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            listings={listings} 
            bannerUrl={bannerUrl}
            onListingClick={handleListingClick} 
            onSearch={(filters) => console.log('Search triggered', filters)} 
            onCategoryClick={handleCategoryClick} 
          />
        );
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'listing_detail':
        return activeListing && activeListingOwner ? (
          <ListingDetail 
            listing={activeListing} 
            owner={activeListingOwner} 
            currentUser={user}
            onBack={() => setCurrentPage('home')}
            onContact={() => user ? setIsChatOpen(true) : setCurrentPage('auth')}
            onAction={() => user ? setIsContractOpen(true) : setCurrentPage('auth')}
          />
        ) : <Home listings={listings} bannerUrl={bannerUrl} onListingClick={handleListingClick} onSearch={() => {}} onCategoryClick={handleCategoryClick} />;
      case 'dashboard':
        return user ? (
          <Dashboard 
            user={user} 
            listings={listings} 
            onListingAction={(id, action) => {
              if (action === 'delete') handleDeleteListing(id);
            }} 
            onUpdateListing={handleUpdateListing}
            onNavigateToListing={handleListingClick} 
            onNavigateMessages={() => setCurrentPage('inbox')}
          />
        ) : <Auth onLogin={handleLogin} />;
      case 'inbox':
        return user ? (
          <Inbox 
            currentUser={user} 
            messages={allMessages} 
            listings={listings} 
            users={allUsers}
            onSendMessage={handleSendMessage}
            onNavigateToListing={handleListingClick}
          />
        ) : <Auth onLogin={handleLogin} />;
      case 'admin_dashboard':
        return user?.role === UserRole.ADMIN ? (
          <AdminDashboard 
            users={allUsers} 
            listings={listings} 
            onVerifyUser={handleVerifyUser} 
            onUpdateUser={handleUpdateUser}
            onModerateListing={handleModerateListing}
            onUpdateListing={handleUpdateListing}
            onDeleteListing={handleDeleteListing}
            onNavigateToListing={handleListingClick}
            onEnterGodMode={() => setCurrentPage('god_mode')}
          />
        ) : <Auth onLogin={handleLogin} />;
      case 'god_mode':
        return user?.role === UserRole.ADMIN ? (
          <GodMode 
            users={allUsers} 
            listings={listings} 
            bannerUrl={bannerUrl}
            onUpdateBanner={setBannerUrl}
            onUpdateUsers={setAllUsers}
            onUpdateListings={setListings}
            onBack={() => setCurrentPage('admin_dashboard')}
          />
        ) : <Auth onLogin={handleLogin} />;
      case 'categories':
        return (
          <Categories 
            listings={listings} 
            onCategoryClick={handleCategoryClick} 
            onBack={() => setCurrentPage('home')} 
          />
        );
      case 'create':
        return user ? (
          <CreateListing 
            currentUser={user}
            onAddListing={handleAddListing}
            onBack={() => setCurrentPage('home')}
          />
        ) : <Auth onLogin={handleLogin} />;
      default:
        return <Home listings={listings} bannerUrl={bannerUrl} onListingClick={handleListingClick} onSearch={() => {}} onCategoryClick={handleCategoryClick} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 ${currentPage === 'god_mode' ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      {currentPage !== 'god_mode' && (
        <Navbar 
          user={user} 
          notifications={userNotifications} 
          messages={allMessages}
          onLogout={handleLogout} 
          onNavigate={setCurrentPage} 
          onMarkAsRead={handleMarkAsRead}
          currentPage={currentPage}
        />
      )}
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      {isChatOpen && activeListing && activeListingOwner && user && (
        <ChatSystem 
          currentUser={user} 
          listing={activeListing} 
          owner={activeListingOwner} 
          messages={activeChatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setIsChatOpen(false)} 
        />
      )}

      {isContractOpen && activeListing && user && (
        <ContractFlow 
          listing={activeListing} 
          client={user} 
          onComplete={() => {
            setIsContractOpen(false);
            setCurrentPage('dashboard');
          }}
          onCancel={() => setIsContractOpen(false)}
        />
      )}

      {currentPage !== 'god_mode' && (
        <footer className="bg-white border-t py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-2xl font-bold text-blue-700 mb-2">FACIL Angola</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Inovação Imobiliária e Automóvel</p>
            <p className="text-gray-400 text-[10px] mt-4">© 2024 FACIL. Todos os direitos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
