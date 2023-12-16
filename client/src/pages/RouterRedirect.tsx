import { useEffect } from "react"
import { useAuth } from "../utils/AuthUserProvider"
import { useNavigate } from "react-router-dom";


const RouterRedirect = () => {
    const user = useAuth();
    const navigate = useNavigate();


    //Redirects from base url to homepage or login page based on whether the user information is available
    useEffect(() => {
        if(user.user === null || user.user === undefined){
            navigate("/login")
        } else{
            navigate("/home")
        }
        
    }, [user.user])

    return <></>
}

export default RouterRedirect