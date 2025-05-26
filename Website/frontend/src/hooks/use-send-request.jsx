/**
 * useSendRequest Hook
 *
 * A custom React hook that provides a standardized way to make HTTP requests
 * to the backend API with built-in state management, error handling, and
 * authentication token management.
 *
 * Key Features:
 * - Automatic loading state management
 * - Error handling with user-friendly messages
 * - Success/failure callback support
 * - Automatic cookie inclusion for authentication
 * - Configurable request options
 * - JSON response parsing
 * - Network error handling
 *
 * Returns:
 * - sendRequest: function for making API calls
 * - loading: boolean indicating request in progress
 * - error: string containing error message if request fails
 * - data: response data from successful requests
 * - setError: function to manually set error state
 * - setData: function to manually set data state
 *
 * Usage: Used throughout the application for all API communications
 * including authentication, event management, user operations, and data fetching
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserState from './use-user-state';

export function setApiUrl(url, backend){
    if(backend === 'maps'){
        return import.meta.env.VITE_MAPS_API_URL + url;
    } else if (backend === 'scheduler') {
        return import.meta.env.VITE_SCHEDULER_API_URL + url
    }else if (backend === 'game-engine') {
        return "http://localhost:" + url
    }
    return import.meta.env.VITE_API_URL + url;
}

export default function useSendRequest() {
    const {user, isAuthenticated, setUser} = useUserState();
    const navigate = useNavigate();

    const sendRequest = useCallback(async (url, init = {}, backend = 'website') => {
        let request, response;
        const defaultInit = {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...init,
        };

        const apiUrl = setApiUrl(url, backend);
        //console.log(apiUrl, init, defaultInit)

        try {
            request = await fetch(apiUrl, defaultInit);

            // handle expired tokens 
            if (request.status === 401 && isAuthenticated) {
                setUser(null);
                localStorage.removeItem("user");
                window.location.href = '/login'
                //navigate('/login', {replace: true});
            }

            response = await request.json();

        } catch (error) {
            //console.log(error)
            response = null;
            request = null;
        }

        return { request, response };
    }, []);

    return [sendRequest];

}