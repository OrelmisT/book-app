
import React, { useEffect, useState, useContext } from 'react'
import {post, profile, reply} from '../types';
import '../styles/Profile.css';
import { useAuth } from '../utils/AuthUserProvider';
import { signOut } from '../utils/auth';
import Post from './Post';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfileContext } from '../index';
import Reply from '../components/Reply'
import { deleteUserProfile, getUser, getUserPosts, getUserReplies } from '../utils/api';
import {useQuery} from 'react-query';
import {storage} from '../utils/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'


//Edit this so that it can be used to view your own profile or another person's profile

const Profile = () => { 

  const[uProfile, setUserProfile] = useContext(ProfileContext);
  const[userProfile, setUProfile] = useState({} as profile)

  const user = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState(0); //0 = Posts, 1 = Comments, 2 = Profile Edit
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [bio, setBio] = useState(userProfile.bio);
  const [photoURL, setPhotoURL] = useState(userProfile.photoURL);

  const [imageUpload, setImageUpload] = useState(null as File | null)

  const routeParams = useParams()

  const uploadImage = async () => {
    if (imageUpload === null){
      return null;
    }

    else{
      const imageId = Date.now()
      const imageRef = ref(storage, `images/${imageId}`);

      await uploadBytes(imageRef, imageUpload)
      const url = await getDownloadURL(imageRef);
      return url

      // uploadBytes(imageRef, imageUpload).then(() => {



      //   getDownloadURL(imageRef).then((url) => {return url})
        
        
        
      // })
        
    }
  }
  
  useEffect(() => {
    console.log('here')

    if(routeParams?.userId === null || routeParams?.userId === undefined ){
      setUProfile(uProfile)
      setBio(uProfile.bio)
      setDisplayName(uProfile.displayName)
      setPhotoURL(uProfile.photoURL)

      return 
    }
    else if(routeParams.userId === user.user?.uid) {
      setUProfile(uProfile)
      setBio(uProfile.bio)
      setDisplayName(uProfile.displayName)
      setPhotoURL(uProfile.photoURL)
      return

    }
    else{

      const getUserInfo = async() => {
        const profile = await getUser(routeParams.userId || '')
        setUProfile(profile)
        setBio(profile.bio)
        setDisplayName(profile.displayName)
        setPhotoURL(profile.photoURL)
      }

      getUserInfo()
    }

    


  }, [uProfile, routeParams.userId])

  //Delete User
  const deleteUser = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    deleteUserProfile(userProfile.uid)
    user.clearUser?.();
    signOut();
    navigate("/login")
}


  const updateProfile = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const newImageUrl = await uploadImage() ?? photoURL;
  
    const updatedUser = {displayName: displayName
      , bio: bio, photoURL: newImageUrl, uid: userProfile.uid, readingList: userProfile.readingList,
       email: userProfile.email};


    setUserProfile(updatedUser);

      setBio(updatedUser.bio)
      setDisplayName(updatedUser.displayName)
      setPhotoURL(newImageUrl)

    setView(0);

  }

  const cancelSubmit = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setDisplayName(userProfile.displayName);
    setBio(userProfile.bio)
    setPhotoURL(userProfile.photoURL)
    setView(0);
  }

  const userPostsQuery = useQuery({
      enabled: userProfile?.uid !== undefined && userProfile?.uid !== null,
      queryKey: ["userPosts",userProfile?.uid],
      queryFn:() => getUserPosts(userProfile.uid).then((fetchedPosts) => fetchedPosts),
      initialData: []
  })

  const userRepliesQuery = useQuery({
    enabled: userProfile?.uid !== undefined && userProfile?.uid !== null,
    queryKey: ["userReplies",userProfile?.uid],
    queryFn:() => getUserReplies(userProfile.uid).then((fetchedReplies) => fetchedReplies),
    initialData: []
})

  return (

    <div>
      <div className='Profile'>

        <h1>{userProfile.displayName}</h1>
        <div className='image-circle-cropper' style={{backgroundImage: `url(${userProfile.photoURL})`}}>
          {/* <img src={userProfile.photoURL} alt='Profile Picture' className='prof-photo'/> */}
        </div>
        <h2>{userProfile.bio}</h2>
        {((view === 0 || view === 1) && userProfile.uid === uProfile.uid )&& <button onClick={() => setView(2)}>Edit Profile</button>}
      </div>
      {
        view === 0 ? (
          <div className='ProfilePosts'>
            <div className='PostOrReply'>
              <h1 className='isSelected pointer'>Posts</h1>
              <h1 onClick={() => setView(1)} className='pointer'>Replies</h1>
            </div>
            {userPostsQuery.data.map((p : post) => <Post {...p} key = {p.postId}/>)}
            {userPostsQuery.isLoading ? <h2>Loading...</h2> : <></>}
            {userPostsQuery.data.length < 1 && !userPostsQuery.isLoading ? <h2>No posts yet!</h2> : <></>}
          </div>
        ) : view === 1 ? (
          <div className='ProfileComments'>
            <div className='PostOrReply'>
              <h1 onClick={() => setView(0)} className='pointer'>Posts</h1>
              <h1 className='isSelected pointer'>Replies</h1>
            </div>
            {userRepliesQuery.data.map((r : reply) => <Reply {...r}/>)}
            {userRepliesQuery.isLoading ? <h2>Loading...</h2> : <></>}
            {userRepliesQuery.data.length < 1 && !userRepliesQuery.isLoading ? <h2>No replies yet!</h2> : <></>}
          </div>
        ) : (
          <div className='ProfileEdit'>
            <form>
                <p>Display Name:</p>
                <input type='text' value={displayName} onChange={(e) =>setDisplayName(e.target.value)}></input>
                <p>Bio:</p>
                <input type='text' value={bio} onChange={(e) => setBio(e.target.value)}></input>
                <p>Profile Photo:</p>
                <input id="pfpInput" type='file' onChange={(event) => setImageUpload(event.target.files ? event.target.files[0] : null)}></input>
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
