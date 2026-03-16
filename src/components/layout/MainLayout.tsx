
import React, { Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PageSkeleton } from '../common/Loading';
import { ROUTES } from '../../routes/config';

interface MainLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideNavbar = false,
  hideFooter = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'home': ROUTES.HOME,
      'auth': ROUTES.AUTH,
      'categories': ROUTES.CATEGORIES,
      'create': ROUTES.CREATE_LISTING,
      'dashboard': ROUTES.DASHBOARD,
      'inbox': ROUTES.INBOX,
      'admin_dashboard': ROUTES.ADMIN_DASHBOARD,
      'god_mode': ROUTES.GOD_MODE,
      'map_search': ROUTES.MAP_SEARCH,
    };
    navigate(routeMap[page] || ROUTES.HOME);
  };

  const getCurrentPage = (): string => {
    const path = location.pathname;
    if (path === ROUTES.HOME) return 'home';
    if (path.startsWith('/listing/')) return 'listing_detail';
    if (path.startsWith(ROUTES.CATEGORIES)) return 'categories';
    if (path === ROUTES.AUTH) return 'auth';
    if (path === ROUTES.CREATE_LISTING) return 'create';
    if (path === ROUTES.DASHBOARD) return 'dashboard';
    if (path === ROUTES.INBOX) return 'inbox';
    if (path === ROUTES.ADMIN_DASHBOARD) return 'admin_dashboard';
    if (path === ROUTES.GOD_MODE) return 'god_mode';
    if (path === ROUTES.MAP_SEARCH) return 'map_search';
    return 'home';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-gray-50">
      {!hideNavbar && (
        <Navbar
          onNavigate={handleNavigate}
          currentPage={getCurrentPage()}
        />
      )}

      <main className="flex-grow">
        <Suspense fallback={<PageSkeleton />}>
          {children}
        </Suspense>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};
