import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserState from './use-user-state';

export function buildUrl(url, searchParams, supportedParams, extraParams = []){

}

export function setApiUrl(url){
    return import.meta.env.API_URL + url;
}

export default function useSendRequest() {
    const {setUser} = useUserState();

    const sendRequest = useCallback(async (url, init = {}) => {
        let request, response;
        const defaultInit = {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...init,
        };

        const apiUrl = setApiUrl(url);

        try {
            request = await fetch(apiUrl, defaultInit);

            // handle expired tokens 
            if (request.status === 401) {
                setUser(null);
                //navigate to login page
            }

            response = await request.json();
        } catch (error) {
            response = null;
            request = null;
        }

        return { request, response };
    }, []);

    return [sendRequest];

}