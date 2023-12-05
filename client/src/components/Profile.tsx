
import React, { useEffect, useState } from 'react'
import { profile, post} from '../types';
import '../styles/Profile.css';
import { useAuth } from '../utils/AuthUserProvider';
import { signOut } from '../utils/auth';
import Post from './Post';


const Profile = (props:{displayName:string, bio:string, uid:string, readingList: string[], email:string, photoURL:string, setUserProfile: React.Dispatch<React.SetStateAction<profile>>, setPage: React.Dispatch<React.SetStateAction<number>>}) => {

  const user = useAuth();

  const [view, setView] = useState(0); //0 = Posts, 1 = Comments, 2 = Profile Edit
  const [displayName, setDisplayName] = useState(props.displayName);
  const [bio, setBio] = useState(props.bio);
  const [photoURL, setPhotoURL] = useState(props.photoURL);
  const [posts, setPosts] = useState([] as post[]);

  //Delete User
  const deleteUser = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/api/users/${props.uid}`, {method: 'DELETE'})
    user.clearUser?.();
    signOut();
    props.setPage(0);
}


  const updateProfile = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const updatedUser = {displayName: displayName
      , bio: bio, photoURL: photoURL, uid: props.uid, readingList: props.readingList,
       email: props.email};


    props.setUserProfile(updatedUser);

    setView(0);

  }

  const getPosts = async () => {
    const res = await fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/api/users/${props.uid}/posts`);
    const d = await res.json();
    setPosts(d.posts);
  }

  // Fetch User's comments and posts
  useEffect(() => {
    getPosts();
    
  }, []);

  return (

    <div>
      <div className='Profile'>

        <h1>{props.displayName}</h1>
        <img src={props.photoURL} alt='Profile Picture'/>
        <h2>{props.bio}</h2>
        {(view === 0 || view === 1) && <button onClick={() => setView(2)}>Edit Profile</button>}
      </div>
      {
        view === 0 ? (
          <div className='ProfilePosts'>
            <h1>Posts</h1>
            {posts.map((p) => <Post {...p}/>)}
          </div>
        ) : view === 1 ? (
          <div className='ProfileComments'>
            <h1>Comments</h1>
          </div>
        ) : (
          <div className='ProfileEdit'>
            <form>
                <p>Display Name:</p>
                <input type='text' value={displayName} onChange={(e) =>setDisplayName(e.target.value)}></input>
                <p>Bio:</p>
                <input type='text' value={bio} onChange={(e) => setBio(e.target.value)}></input>
                <p>Photo URL:</p>
                <input type='text' value={photoURL} onChange={(e) => setPhotoURL(e.target.value)}></input>
                <div className='DeleteUser'>
                  <button onClick={(e) => deleteUser(e)}>Delete User</button>
                </div>
                <div className='save'>
                  <button onClick={ (e) => updateProfile(e)} type='submit'>Save</button>
                </div>
            </form>
          </div>
        )
      }

    </div>

  )
}

export default Profile
