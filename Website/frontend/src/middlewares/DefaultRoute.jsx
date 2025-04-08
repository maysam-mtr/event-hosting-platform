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