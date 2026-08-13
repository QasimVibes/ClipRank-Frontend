import { Navigate } from 'react-router-dom';
import FullPageLoader from './FullPageLoader';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <FullPageLoader />
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
