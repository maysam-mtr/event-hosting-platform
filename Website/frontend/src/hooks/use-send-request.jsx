import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserState from './use-user-state';

// export function buildUrl(url, searchParams, supportedParams, extraParams = []){

// }

export function setApiUrl(url, backend){
    if(backend === 'maps'){
        return import.meta.env.VITE_MAPS_API_URL + url;
    } else if (backend == 'game-engine') {
        return import.meta.env.VITE_GAME_ENGINE_API_URL + url
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