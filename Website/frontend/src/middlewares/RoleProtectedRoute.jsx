import { Outlet, useNavigate } from "react-router-dom";
import useUserState from "../hooks/use-user-state";
//import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { useEffect } from "react";
import PropType from 'prop-types';
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