import { useContext, useEffect, useState,  createRef } from 'react'
import { useAuth } from '../utils/AuthUserProvider';
import '../styles/UserInterface.css';
import { signOut } from '../utils/auth';
import { NavLink, Outlet, useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import { ProfileContext } from '../index'
import axios from 'axios';
import { IoHome } from "@react-icons/all-files/io5/IoHome";
import { IoHomeOutline} from "@react-icons/all-files/io5/IoHomeOutline";
import { IoPersonOutline } from "@react-icons/all-files/io5/IoPersonOutline";
import { IoPerson } from "@react-icons/all-files/io5/IoPerson";
import { RiBook3Fill } from "@react-icons/all-files/ri/RiBook3Fill";
import { RiBook3Line } from "@react-icons/all-files/ri/RiBook3Line";
import { IoSearchOutline } from "@react-icons/all-files/io5/IoSearchOutline";
import { IoSearchSharp } from "@react-icons/all-files/io5/IoSearchSharp";














const UserInterface = () => {
    const [dropDownActivated, setDropDownActivated] = useState(false)
    const user = useAuth();
    const navigate = useNavigate();
    const location = useLocation()
    const path =  location.pathname;
    const queryParamsPath = location.search;
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('query')
    const searchStartIndex = searchParams.get('startIndex')

    const dropDownRef = createRef<HTMLDivElement>();
    const pfpRef = createRef<HTMLDivElement>();


    useEffect(() => {
        if(!user.user){
            console.log(queryParamsPath)
            navigate(`/login?redirect-to=${path}`, {state:{searchQuery, searchStartIndex}})
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
                    photoURL: 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
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
            
    }, [user.user])

    useEffect(() => {
        setPfp(userProfile.photoURL);
        axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}`, userProfile);
        
    }, [userProfile]);


    useEffect( () => {

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore 
        const handleOutsideClick = (e) => {
            if(dropDownRef.current && !dropDownRef.current.contains(e.target) && dropDownActivated ){
                setDropDownActivated(false);
            }
            else if (pfpRef.current?.contains(e.target) && !dropDownActivated){
                setDropDownActivated(true)
            }
        }
        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }

    }, [dropDownRef])


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
                <div ref={dropDownRef} className={`dropDown ${dropDownActivated? 'dropDownIsActive' : 'dropDownIsInactive'}`} >
                    <ul>
                        <li onClick={ () => {navigate('settings'); setDropDownActivated(false);}}>Settings</li>
                        <li onClick={() => {navigate('saved');setDropDownActivated(false)}}>Saved</li>
                        <li onClick={() => {navigate('following'); setDropDownActivated(false)}}>Following</li>
                        <li onClick={() => {navigate('messages'); setDropDownActivated(false)}}>Messages</li>
                        <li onClick={() => {signOutHandler(); setDropDownActivated(false)}}>Sign Out</li>
                    </ul>

                </div> 


            </div>

            <div className='navBarGroup' id='centerNavBar'>
                <NavLink to="." end className={({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Home</h2></NavLink>
                <NavLink to = "profile" className={({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Profile</h2></NavLink>
                <NavLink to = "reading-list" className={({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Reading List</h2></NavLink>
                <NavLink to = "search" className = {({isActive}) => isActive ? 'active navLink' : 'navLink' }><h2>Search</h2></NavLink>
            </div>

            <div className='navBarGroup'>
                <div className='navBarItem' ref={pfpRef} id = {"pfp"} style={{backgroundImage:`url(${pfp})`}} ></div>
                {/* <img src={pfp} alt='Profile Picture' className='navBarItem' id={"pfp"} onClick={() => setDropDownActivated(prev => !prev )}></img> */}
            </div>

            
        

        </div>

        

        <Outlet />

        <div className='MobileNavBar'>
                <div className='mobileHome'>
                    <NavLink to="." end className={({isActive}) => isActive ? '' : 'inactiveMobileNav' }><IoHome color='black' size={40}></IoHome></NavLink>
                    <NavLink to="." end className={({isActive}) => isActive ? 'inactiveMobileNav' : '' }><IoHomeOutline color='black' size={40}></IoHomeOutline></NavLink>
                </div>
                <div className='mobileProfile'>
                    <NavLink to = "profile" className={({isActive}) => isActive ? '' : 'inactiveMobileNav' }><IoPerson color='black' size={40}></IoPerson></NavLink>
                    <NavLink to = "profile" className={({isActive}) => isActive ? 'inactiveMobileNav' : '' }><IoPersonOutline color='black' size={40}></IoPersonOutline></NavLink>
                </div>
                <div className='mobileReadingList'>
                    <NavLink to = "reading-list" className={({isActive}) => isActive ? '' : 'inactiveMobileNav' }><RiBook3Fill color='black' size={40}></RiBook3Fill></NavLink>
                    <NavLink to = "reading-list" className={({isActive}) => isActive ? 'inactiveMobileNav' : '' }><RiBook3Line color='black' size={40}></RiBook3Line></NavLink>
                </div>
                <div className='mobileSearch'>
                    <NavLink to = "search" className = {({isActive}) => isActive ? '' : 'inactiveMobileNav' }><IoSearchSharp color='black' size={40}></IoSearchSharp></NavLink>
                    <NavLink to = "search" className = {({isActive}) => isActive ? 'inactiveMobileNav' : '' }><IoSearchOutline color='black' size={40}></IoSearchOutline></NavLink>

                </div>
        </div>
    </>
  )
}

export default UserInterface
