import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthUserProvider';
import '../styles/UserInterface.css';
import { signOut } from '../utils/auth';
import Home from './Home';
import Profile from './Profile';
import ReadingList from './ReadingList';
import Search from './Search';
import {book, profile} from '../types'


const UserInterface = (props: {setPage: React.Dispatch<React.SetStateAction<number>>}) => {
    const user = useAuth();
    const [pfp, setPfp] = useState('https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg');
    
    const [userProfile, setUserProfile] = useState<profile>({} as profile);
    const [contentPage, setContentPage] = useState(0);
    const [books, setBooks] = useState([] as book[]);


    const getReadingList =  () => {
            setContentPage(2);
    }

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
            fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/api/users/${uid}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(defaultProfile)})
            .then(res => res.json()).then(data => {
                console.log('User Data:');
                console.log(data);
                setUserProfile(data);
                console.log(data.photoURL);
                setPfp(data.photoURL)
            });
 
        }
            
    }, [])

    useEffect(() => {
        setPfp(userProfile.photoURL);
        fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/api/users/${userProfile.uid}`,
        {method: 'PUT', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( userProfile)});



        if(userProfile.readingList){
        const readingList = userProfile.readingList;
            const booksList = [] as book[];
            for (const bookId of readingList){
                fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${import.meta.env.REACT_APP_BOOKS_KEY}`)
                .then(res => res.json()).then(data => {
                    booksList.push(data);
                })
            }
            setBooks(booksList);
        }
        
    }, [userProfile]);

    //sign out
    const signOutHandler = () => {
        user.clearUser?.();
        signOut();
        props.setPage(0);
    }

  return (
    <>
        <div className='banner'>
            
            <div className='navBarGroup'>
                <h1 className='navBarItem'>The Bookshelf Society</h1>
                <img src='https://i.imgur.com/gcUlma9.png' id='logo' className='navBarItem'></img>
            </div>

            <div className='navBarGroup' id='centerNavBar'>
                <h2 onClick={() => setContentPage(0)}>Home</h2>
                <h2 onClick={() => setContentPage(1)}>Profile</h2>
                <h2 onClick={getReadingList}>Reading List</h2>
                <h2 onClick={() => setContentPage(3)}>Search</h2>
            </div>

            <div className='navBarGroup'>
                <img src={pfp} alt='Profile Picture' className='navBarItem'></img>
                <button onClick={signOutHandler} className='navBarItem'>Sign Out</button>
            </div>
        

        </div>
        <div className='page Body'>
        </div>
        <PageContent books={books} pageNumber={contentPage} user= {userProfile} setUserProfile={setUserProfile} setPage = {props.setPage}/>
    </>
  )
}



const PageContent = (props:{pageNumber:number, books: book[], user:profile, setUserProfile: React.Dispatch<React.SetStateAction<profile>>, setPage:React.Dispatch<React.SetStateAction<number>>}) => {

    const page = props.pageNumber;


    if(page === 0) return(
        <Home {...props.user}/>
    )

    if(page === 1) return(
        <Profile {...props.user} setUserProfile = {props.setUserProfile} setPage = {props.setPage}/>
    )

    if(page === 2) return(
        <ReadingList books = {props.books} user = {props.user} setUserProfile = {props.setUserProfile}/>
    )

    if(page === 3) return(
        <Search user={props.user} setUserProfile={props.setUserProfile}/>
    )
    return(
        <></>
    )
}

export default UserInterface
