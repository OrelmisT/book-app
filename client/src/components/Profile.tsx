
import React, { useEffect, useState, useContext } from 'react'
import {post, reply} from '../types';
import '../styles/Profile.css';
import { useAuth } from '../utils/AuthUserProvider';
import { signOut } from '../utils/auth';
import Post from './Post';
import { useNavigate } from 'react-router-dom';
import { ProfileContext } from '../index';
import axios from 'axios';
import Reply from '../components/Reply'


const Profile = () => {

  const[userProfile, setUserProfile] = useContext(ProfileContext);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState(0); //0 = Posts, 1 = Comments, 2 = Profile Edit
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [bio, setBio] = useState(userProfile.bio);
  const [photoURL, setPhotoURL] = useState(userProfile.photoURL);
  const [posts, setPosts] = useState([] as post[]);
  const [replies, setReplies] = useState([] as reply[])

  //Delete User
  const deleteUser = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    axios.delete(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}`);
    user.clearUser?.();
    signOut();
    navigate("/login")
}


  const updateProfile = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const updatedUser = {displayName: displayName
      , bio: bio, photoURL: photoURL, uid: userProfile.uid, readingList: userProfile.readingList,
       email: userProfile.email};


    setUserProfile(updatedUser);

    setView(0);

  }

  const cancelSubmit = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setDisplayName(userProfile.displayName);
    setBio(userProfile.bio)
    setPhotoURL(userProfile.photoURL)
    setView(0);
  }

  // Fetch User's comments and posts
  useEffect(() => {

    setIsLoading(true)
    axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}/posts`)
    .then(({data}) => {setPosts(data.posts || []); setIsLoading(false)});
    
  }, [userProfile]);

  useEffect(() => {
    setIsLoading(true)
    axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}/replies`)
    .then(({data}) =>  {setReplies(data.replies || []); setIsLoading(false); console.log(data.replies)});
  }, [userProfile]);
  

  return (

    <div>
      <div className='Profile'>

        <h1>{userProfile.displayName}</h1>
        <img src={userProfile.photoURL} alt='Profile Picture' className='prof-photo'/>
        <h2>{userProfile.bio}</h2>
        {(view === 0 || view === 1) && <button onClick={() => setView(2)}>Edit Profile</button>}
      </div>
      {
        view === 0 ? (
          <div className='ProfilePosts'>
            <div className='PostOrReply'>
              <h1 className='isSelected pointer'>Posts</h1>
              <h1 onClick={() => setView(1)} className='pointer'>Replies</h1>
            </div>
            {posts.map((p) => <Post {...p} key = {p.postId}/>)}
            {isLoading ? <h2>Loading...</h2> : <></>}
            {posts.length < 1 && !isLoading ? <h2>You haven't made any posts yet!</h2> : <></>}
          </div>
        ) : view === 1 ? (
          <div className='ProfileComments'>
            <div className='PostOrReply'>
              <h1 onClick={() => setView(0)} className='pointer'>Posts</h1>
              <h1 className='isSelected pointer'>Replies</h1>
            </div>
            {replies.map((r) => <Reply {...r}/>)}
            {isLoading ? <h2>Loading...</h2> : <></>}
            {replies.length < 1 && !isLoading ? <h2>You haven't made any replies yet!</h2> : <></>}
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
                <div className='sideBySideButtons'>
                  <button onClick={(e) => cancelSubmit(e)}>Cancel</button> 
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
