import { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_USER = {
    id: null,
    profile_picture: null,//defaultPicture, 
    name: null,
    email: null,
    role: {
        name: null,
        id: null,
    },
};

export const userStateContext = createContext({
    user: DEFAULT_USER,
    isAuthenticated: false,
    isLoading: true,
    setUser: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(DEFAULT_USER);
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
        <userStateContext.Provider value={{ user, isAuthenticated, isLoading, setUser }}>
            {children}
        </userStateContext.Provider>
    );
};

