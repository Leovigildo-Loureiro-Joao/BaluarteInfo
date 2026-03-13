import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, hasRole } from '../../utils/auth.js';

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const token = getAuthToken();
  const isAdmin = hasRole('ADMIN');

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
