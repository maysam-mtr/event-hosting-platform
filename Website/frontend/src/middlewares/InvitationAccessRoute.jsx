/**
 * Invitation Access Route Middleware
 *
 * Controls access to invitation-related pages:
 * - Validates invitation tokens and expiry
 * - Checks invitation status (pending, accepted, declined)
 * - Manages partner invitation flow
 * - Handles invitation response processing
 * - Redirects based on invitation state
 *
 * Ensures only valid invitation holders can access
 * invitation pages and complete the partner onboarding process.
 */

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import useUserState from "../hooks/use-user-state";
import { useEffect } from "react";

export default function InvitationAccessRoute(){
    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated, isLoading} = useUserState();

    useEffect(()=>{
        if (!isAuthenticated && !isLoading) {
            navigate("/login", {replace : true, state: {fromInvitation: true, invitationLink: location.pathname, from: location.pathname}}); 
        }
    },[isAuthenticated,isLoading])

    if (isLoading){
        return <LoadingSpinner />
    }

    if (!isAuthenticated) return null;
    
    return <Outlet />;
}