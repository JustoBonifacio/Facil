
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { ErrorBoundary, LoadingSpinner, PageSkeleton, Navbar, Footer } from './components';
import { ROUTES } from './constants';
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

// ============ PROTECTED ROUTE WRAPPER ============
interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = false,
    requireAdmin = false
}) => {
    const { state } = useApp();
    const location = useLocation();

    if (requireAuth && !state.user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (requireAdmin && state.user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// ============ MAIN LAYOUT ============
const MainLayout: React.FC<{ children: React.ReactNode; hideNavbar?: boolean; hideFooter?: boolean }> = ({
    children,
    hideNavbar = false,
    hideFooter = false
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (page: string) => {
        const routeMap: Record<string, string> = {
            'home': '/',
            'auth': '/auth',
            'categories': '/categories',
            'create': '/create',
            'dashboard': '/dashboard',
            'inbox': '/inbox',
            'admin_dashboard': '/admin',
            'god_mode': '/admin/god-mode',
        };
        navigate(routeMap[page] || '/');
    };

    const getCurrentPage = (): string => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/listing/')) return 'listing_detail';
        if (path.startsWith('/categories')) return 'categories';
        if (path === '/auth') return 'auth';
        if (path === '/create') return 'create';
        if (path === '/dashboard') return 'dashboard';
        if (path === '/inbox') return 'inbox';
        if (path === '/admin') return 'admin_dashboard';
        if (path === '/admin/god-mode') return 'god_mode';
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

// ============ APP ROUTES ============
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                }
            />

            <Route
                path="/auth"
                element={
                    <MainLayout>
                        <AuthPage />
                    </MainLayout>
                }
            />

            <Route
                path="/listing/:id"
                element={
                    <MainLayout>
                        <ListingDetailPage />
                    </MainLayout>
                }
            />

            <Route
                path="/categories"
                element={
                    <MainLayout>
                        <CategoriesPage />
                    </MainLayout>
                }
            />

            <Route
                path="/categories/:category"
                element={
                    <MainLayout>
                        <CategoriesPage />
                    </MainLayout>
                }
            />

            {/* Protected Routes - Require Authentication */}
            <Route
                path="/create"
                element={
                    <ProtectedRoute requireAuth>
                        <MainLayout>
                            <CreateListingPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute requireAuth>
                        <MainLayout>
                            <DashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inbox"
                element={
                    <ProtectedRoute requireAuth>
                        <MainLayout>
                            <InboxPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute requireAuth requireAdmin>
                        <MainLayout>
                            <AdminDashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/god-mode"
                element={
                    <ProtectedRoute requireAuth requireAdmin>
                        <MainLayout hideNavbar hideFooter>
                            <GodModePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* 404 Fallback */}
            <Route
                path="*"
                element={
                    <MainLayout>
                        <NotFoundPage />
                    </MainLayout>
                }
            />
        </Routes>
    );
};

// ============ 404 PAGE ============
const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-8xl font-black text-gray-200 mb-4">404</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
                <p className="text-gray-500 mb-8">A página que procura não existe ou foi movida.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    Voltar ao Início
                </button>
            </div>
        </div>
    );
};

// ============ MAIN APP ============
const App: React.FC = () => {
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
