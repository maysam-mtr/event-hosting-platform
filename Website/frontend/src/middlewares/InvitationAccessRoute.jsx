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