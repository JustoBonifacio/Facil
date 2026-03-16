
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/Loading';
import { UserRole } from '../../shared/types';
import { ROUTES } from '../../routes/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireOwner?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireOwner = false
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="A verificar acessos..." />
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== UserRole.ADMIN) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (requireOwner && user?.role === UserRole.CLIENT) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
