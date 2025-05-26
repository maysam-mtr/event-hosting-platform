/**
 * user-state-context
 * 
 * This file defines a React Context (`userStateContext`) and a Provider component (`UserProvider`) 
 * that manages global user authentication state and event access state across the application.
 * 
 * It:
 * - Initializes default user and event access states.
 * - Loads user data from localStorage on initial render (if available).
 * - Provides `user`, `isAuthenticated`, `isLoading`, and `eventAccess` through context.
 * - Exposes `setUser` and `setEventAccess` for child components to update user-related state.
 * 
 * Wrap parts of the app with `<UserProvider>` to give them access to this shared state using the `useUserState()` hook.
 */

import { createContext, useState, useEffect } from "react";

// Default user state when no user is logged in
const DEFAULT_USER = {
    id: null,
};

// Default event access state (placeholder structure)
const EVENT_ACCESS = {
    id: null,
};

// Create the context with default values
export const userStateContext = createContext({
    user: DEFAULT_USER,
    isAuthenticated: false,
    isLoading: true,
    eventAccess: EVENT_ACCESS,
    setUser: () => {},
    setEventAccess: () => {}
});

// Provider component to wrap around your app or sections that need access to user state
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(DEFAULT_USER);
    const [eventAccess, setEventAccess] = useState(EVENT_ACCESS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on first render, if present
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    // Determine authentication status
    const isAuthenticated = !isLoading && user.id !== null;

    return (
        <userStateContext.Provider value={{ user, isAuthenticated, isLoading, eventAccess, setUser, setEventAccess }}>
            {children}
        </userStateContext.Provider>
    );
};
