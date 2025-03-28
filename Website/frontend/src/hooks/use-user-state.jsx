import { useContext } from "react"
import { userStateContext } from "../contexts/user-state-context"

export default function useUserState(){
    const userState = useContext(userStateContext);
    
    return userState;
}