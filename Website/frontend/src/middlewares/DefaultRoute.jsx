/**
 * Default Route Middleware
 *
 * Handles default routing behavior and redirects:
 * - Redirects users to appropriate dashboard based on role
 * - Handles root path routing logic
 * - Manages initial page load routing
 * - Provides fallback routing for undefined paths
 * - Ensures users land on correct starting page
 *
 * Determines where users should be directed when accessing
 * the application root or undefined routes.
 */

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUserState from "../hooks/use-user-state";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function DefaultRoute(){
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useUserState();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate('/index', { replace: true });
            } else {
                switch (user.role) {
                    case "host":
                        navigate("/host", { replace: true });
                        break;
                    case "admin":
                        // navigate("/dashboard/", {replace : true});
                        break;
                    case "user":
                        navigate("/user", { replace: true });
                        break;
                    default:
                        navigate('/index', { replace: true });
                }
            }
        }
    }, [user, isAuthenticated, isLoading, navigate]);

    if (isLoading) return <LoadingSpinner />;
    return <Outlet />;
}