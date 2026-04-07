
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, authStep } = useAuth();
    const location = useLocation();

    if (authStep !== 'AUTHENTICATED' || !user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their default dashboard if they try to access a forbidden route
        return <Navigate to={user.role === 'admin' ? '/admin-panel' : '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;
