/**
 * Role Protected Route Middleware
 *
 * Manages role-based access control:
 * - Validates user roles (host, user, partner)
 * - Restricts access based on user permissions
 * - Handles role-specific redirects
 * - Manages cross-role navigation restrictions
 * - Provides role-based error handling
 *
 * Ensures users can only access features and pages
 * appropriate for their assigned role in the system.
 */

import { Outlet, useNavigate } from "react-router-dom";
import useUserState from "../hooks/use-user-state";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import PropTypes from "prop-types";

export default function RoleProtectedRoute({requiredRole}){
    const navigate = useNavigate();
    const {user, isAuthenticated, isLoading} = useUserState();

    useEffect(()=>{
        if (!isAuthenticated && !isLoading) {
            navigate("/login", {replace : true}); 
        }

        if (isAuthenticated && user.role != requiredRole){
            navigate("/errors", {
                state: {
                    errorCode: "403",
                    errorMessage: "You do not have the required role to access this page."
                }
            });
        }
    },[user, isAuthenticated,isLoading, requiredRole])

    if (isLoading){
        return <LoadingSpinner />
    }

    if (!isAuthenticated || (isAuthenticated && user.role !== requiredRole)) return null;
    
    return <Outlet />;
}

RoleProtectedRoute.propTypes = {
    requiredRole: PropTypes.string.isRequired,
};