import  {useEffect, useState, useContext} from 'react'
import {post} from '../types';
import Post from './Post';
import {ProfileContext} from '../index'
import axios from 'axios';
import { NavLink } from 'react-router-dom';


const Home = () => {

  const [posts, setPosts] = useState([] as post[]);
  const[userProfile] = useContext(ProfileContext)
  const [isLoading, setIsLoading] = useState(true);


    //Search all posts for books in User's reading list
    useEffect( () => {
      axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}/readingListPosts`,
       {bookList: userProfile.readingList}).then(({data}) => setPosts(data.posts)).then(() => {setIsLoading(false)})
      
     }, [userProfile]);

    
    if (isLoading){
      return(<h1>Loading...</h1>)
    }
    else if((posts?.length ? posts?.length : 0 ) === 0){
      return(

    <div>
      <h1>Add books to your reading list to see posts about them here!</h1>
      <NavLink to="search"><h2>Search Books Here</h2></NavLink>
    </div>
      )
    }
  else {
    return (<>
      <h1>Posts</h1>
      {posts.map((p) => {
        return(
          <Post {...p}></Post>
        )
      })}
    </>)
  }
}

export default Home
