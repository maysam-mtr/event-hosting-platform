import { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_USER = {
    id: null,
};

const EVENT_ACCESS = {
    id: null,
};

export const userStateContext = createContext({
    user: DEFAULT_USER,
    isAuthenticated: false,
    isLoading: true,
    eventAccess: EVENT_ACCESS,
    setUser: () => {},
    setEventAccess: () => {}
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(DEFAULT_USER);
    const [eventAccess, setEventAccess] = useState(EVENT_ACCESS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    // ✅ Fix: Compute authentication AFTER loading is done
    const isAuthenticated = !isLoading && user.id !== null;

    return (
        <userStateContext.Provider value={{ user, isAuthenticated, isLoading, eventAccess, setUser, setEventAccess }}>
            {children}
        </userStateContext.Provider>
    );
};

