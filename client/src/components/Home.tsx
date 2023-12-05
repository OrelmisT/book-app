import  {useEffect, useState} from 'react'
import {post, profile} from '../types';
import Post from './Post';


const Home = (props:profile) => {

  const [posts, setPosts] = useState([] as post[]);

    //Search all posts for books in User's reading list
    useEffect( () => {
      fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${props.uid}/readingListPosts`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify({bookList: props.readingList})}).then(res => res.json()).then((data) => {
      console.log(data.posts);
      setPosts(data.posts);});
     }, [props]);

     

  
    if((posts?.length ? posts?.length : 0 ) === 0){
      return(

    <div>
      <h1>Add Books to Your Reading List and </h1>
      <h1>Engage with Discussions About them Here!</h1>
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
