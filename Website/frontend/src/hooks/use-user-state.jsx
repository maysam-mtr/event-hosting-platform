/**
 * use-user-state
 * 
 * This custom React hook wraps `useContext` for accessing the `userStateContext`.
 * It provides an easy way to consume the global user and event access state across components.
 * 
 * Usage:
 * const { user, isAuthenticated, setUser } = useUserState();
 */

import { useContext } from "react";
import { userStateContext } from "../contexts/user-state-context";

export default function useUserState() {
    return useContext(userStateContext);
}
