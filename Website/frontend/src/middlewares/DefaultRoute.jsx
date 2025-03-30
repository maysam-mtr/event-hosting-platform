import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUserState from "../hooks/use-user-state";
//import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function DefaultRoute(){
    const navigate = useNavigate();
    const {user, isAuthenticated, isLoading} = useUserState();

    useEffect(()=>{
        if (isLoading){
            return// <LoadingSpinner />
        }
    
        if (!isAuthenticated) {
            navigate('/index', {replace: true});
            return// <LoadingSpinner />;
        }
    
        
        if (!isAuthenticated && !isLoading) {
            //navigate("/login", {replace : true}); 
            navigate('/index', {replace: true});
        }

        if (isAuthenticated && user.role.name == "host"){
            navigate("/host", {replace : true});
        }

        if (isAuthenticated && user.role.name == "admin"){
            //navigate("/dashboard/", {replace : true});
        }
        
        if (isAuthenticated && user.role.name == "user"){
            navigate("/user", {replace : true});
        }

        if (isAuthenticated && user.role.name == "partner"){
            //navigate("/system/", {replace : true});
        }
    },[user, isAuthenticated, isLoading])

    if (isLoading) {
        return null;
    }

    return <Outlet />;
}