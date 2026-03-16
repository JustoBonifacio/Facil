
import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts'; 
import { 
  ErrorBoundary, 
  MainLayout, 
  ProtectedRoute 
} from './components';
import { DatabaseSeeder } from './components/dev/DatabaseSeeder';
import { ROUTES } from './routes/config';
import './styles/globals.css';

// ============ LAZY LOADED PAGES ============
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CreateListingPage = lazy(() => import('./pages/CreateListingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InboxPage = lazy(() => import('./pages/InboxPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const GodModePage = lazy(() => import('./pages/GodModePage'));
const MapSearchPage = lazy(() => import('./pages/MapSearchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ============ APP ROUTES ============
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<MainLayout><HomePage /></MainLayout>} />
      <Route path={ROUTES.AUTH} element={<MainLayout><AuthPage /></MainLayout>} />
      <Route path={ROUTES.SETUP} element={<MainLayout><DatabaseSeeder /></MainLayout>} />
      <Route path={ROUTES.LISTING_DETAIL} element={<MainLayout><ListingDetailPage /></MainLayout>} />
      <Route path={ROUTES.CATEGORIES} element={<MainLayout><CategoriesPage /></MainLayout>} />
      <Route path={ROUTES.CATEGORIES_FILTER} element={<MainLayout><CategoriesPage /></MainLayout>} />
      <Route path={ROUTES.MAP_SEARCH} element={<MainLayout hideFooter><MapSearchPage /></MainLayout>} />

      {/* Protected Routes - Client/Owner */}
      <Route path={ROUTES.CREATE_LISTING} element={
        <ProtectedRoute requireAuth requireOwner>
          <MainLayout><CreateListingPage /></MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={ROUTES.DASHBOARD} element={
        <ProtectedRoute requireAuth>
          <MainLayout><DashboardPage /></MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={ROUTES.INBOX} element={
        <ProtectedRoute requireAuth>
          <MainLayout><InboxPage /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path={ROUTES.ADMIN_DASHBOARD} element={
        <ProtectedRoute requireAuth requireAdmin>
          <MainLayout><AdminDashboardPage /></MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={ROUTES.GOD_MODE} element={
        <ProtectedRoute requireAuth requireAdmin>
          <MainLayout hideNavbar hideFooter><GodModePage /></MainLayout>
        </ProtectedRoute>
      } />

      {/* 404 Fallback */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  );
};

// ============ MAIN APP ============
const App = () => {
    return (
        <ErrorBoundary>
            <AppProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AppProvider>
        </ErrorBoundary>
    );
};

export default App;
