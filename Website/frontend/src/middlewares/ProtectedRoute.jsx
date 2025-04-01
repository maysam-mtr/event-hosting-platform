import { Outlet, useNavigate } from "react-router-dom";
import useUserState from "../hooks/use-user-state";
//import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
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

    // Prevent rendering child components if not authenticated, 
    // since useNavigate is async, and while performing navgation, parts of the child might render
    if (!isAuthenticated) return null;
    
    return <Outlet />;
}