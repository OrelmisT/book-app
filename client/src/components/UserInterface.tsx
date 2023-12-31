import { useContext, useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthUserProvider';
import '../styles/UserInterface.css';
import { signOut } from '../utils/auth';
import { NavLink, Outlet, useNavigate, useLocation} from 'react-router-dom';
import { ProfileContext } from '../index'
import axios from 'axios';


const UserInterface = () => {
    const user = useAuth();
    const navigate = useNavigate();
    const path =  useLocation().pathname

    useEffect(() => {
        if(!user.user){
            navigate(`/login?redirect-to=${path}`)
        }
    }, [])


    const [pfp, setPfp] = useState('https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg');
    
    const[userProfile, setUserProfile] = useContext(ProfileContext)


    //Fetch User Data. If user data doesn't exist, create it.
    useEffect( () => {
        const uid = user.user?.uid;
        if(uid){

            

            //Uses google profile photo by default, an empty bio, and an empty reading list.
            const defaultProfile = {
                person:{

                    displayName: user.user?.displayName,
                    uid: uid,
                    email: user.user?.email,
                    photoURL: user.user?.photoURL,
                    bio: '',
                    readingList: [] as string[]
                }
            }

            axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${uid}`, 
            defaultProfile).then(({data}) => {
                setUserProfile(data);
                setPfp(data.photoURL);
            })
            

        }
            
    }, [])

    useEffect(() => {
        setPfp(userProfile.photoURL);
        // fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}`,
        // {method: 'PUT', headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify( userProfile)});

        axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}`, userProfile);
        
    }, [userProfile]);

    //sign out
    const signOutHandler = () => {
        user.clearUser?.();
        signOut();
        navigate("/login");
    }

  return (
    <>
        <div className='banner'>
            
            <div className='navBarGroup'>
                <h1 className='navBarItem' onClick={() => navigate("/home")}>The Bookshelf Society</h1>
                <img src='https://i.imgur.com/gcUlma9.png' id='logo' className='navBarItem'></img>
            </div>

            <div className='navBarGroup' id='centerNavBar'>
                <NavLink to="." end className={({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Home</h2></NavLink>
                <NavLink to = "profile" className={({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Profile</h2></NavLink>
                <NavLink to = "reading-list" className={({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Reading List</h2></NavLink>
                <NavLink to = "search" className = {({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Search</h2></NavLink>
            </div>

            <div className='navBarGroup'>
                <img src={pfp} alt='Profile Picture' className='navBarItem' id={"pfp"} onClick={() => navigate("profile")}></img>
                <button onClick={signOutHandler} className='navBarItem'>Sign Out</button>
            </div>
        

        </div>

        <Outlet />
    
        {/* <PageContent  pageNumber={contentPage}/> */}
    </>
  )
}

export default UserInterface
