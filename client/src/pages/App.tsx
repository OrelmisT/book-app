import { useEffect } from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import { useAuth } from '../utils/AuthUserProvider';

function App() {

    const user = useAuth();
    const nav = useNavigate();

    useEffect( () => {
        if(user.user == null || user.user == undefined){
            nav("/login")
        }

    },[])

        return (
        <>      
            <Outlet/>
        </>
    );
}

export default App;
