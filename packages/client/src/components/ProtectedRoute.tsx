import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated } = useAuth();
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
  }, [isLoading]);
  // Show loading while checking auth status
  if (isLoading) {
    return <Loader />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;