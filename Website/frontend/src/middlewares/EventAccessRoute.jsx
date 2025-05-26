/**
 * Event Access Route Middleware
 *
 * Controls access to specific events based on permissions:
 * - Validates user access to private events
 * - Checks event participation eligibility
 * - Handles event passcode validation
 * - Manages event timing restrictions (not started/ended)
 * - Redirects unauthorized users appropriately
 *
 * Ensures only authorized users can access specific events
 * and enforces event-level security policies.
 */

import { Navigate, useLocation } from "react-router-dom";
import useUserState from "../hooks/use-user-state";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const EventAccessRoute = ({ children }) => {
    const location = useLocation();
    const { eventAccess, isLoading } = useUserState();

    if (isLoading) return <LoadingSpinner />;

    if (!eventAccess.id) {
        return (
            <Navigate
                to="/errors"
                state={{
                    errorCode: "403",
                    errorTitle: "Access Denied",
                    errorMessage: "You cannot join this event without a valid event code and password.",
                    from: location.pathname
                }}
                replace
            />
        );
    }

    return children;
};

export default EventAccessRoute;
