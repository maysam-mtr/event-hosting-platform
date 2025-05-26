/**
 * Protected Route Middleware
 *
 * Handles authentication-based route protection:
 * - Validates user authentication status
 * - Redirects unauthenticated users to login
 * - Manages session validation and refresh
 * - Handles authentication token verification
 * - Provides loading states during auth checks
 *
 * Core security middleware that ensures only authenticated
 * users can access protected application areas.
 */

import { Outlet, useNavigate } from "react-router-dom";
import useUserState from "../hooks/use-user-state";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function ProtectedRoute(){
    const navigate = useNavigate();
    const {isAuthenticated, isLoading} = useUserState();

    useEffect(()=>{
        if (!isAuthenticated && !isLoading) {
            navigate("/login", {replace : true}); 
        }
    },[isAuthenticated,isLoading])

    if (isLoading){
        return <LoadingSpinner />
    }

    // Prevent rendering child components if not authenticated
    if (!isAuthenticated) return null;
    
    return <Outlet />;
}