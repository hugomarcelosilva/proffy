import AppRoutes from './app-routes';
import AuthRoutes from './auth-routes';
import React from 'react';
import { useAuth } from '../contexts/auth';

const Routes = () => {
  const { signed } = useAuth();

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
