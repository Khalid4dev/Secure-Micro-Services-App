
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ role }: { role?: string }) => {
    const { authenticated, hasRole } = useAuth();

    if (!authenticated) {
        return <div>Redirecting to login...</div>;
    }

    if (role && !hasRole(role)) {
        return <Navigate to="/access-denied" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
