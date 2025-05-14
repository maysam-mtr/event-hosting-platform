import { Outlet, useNavigate } from "react-router-dom";
import useUserState from "../hooks/use-user-state";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function PartnerAccessRoute(){
    const navigate = useNavigate();
    const {user} = useUserState();

    useEffect(()=>{
        if (user.isPartner !== 1){
            navigate("/errors", {
                state: {
                    errorCode: "403",
                    errorMessage: "You do not have the required role to access this page."
                }
            });
        }
    },[user])
    
    return <Outlet />;
}