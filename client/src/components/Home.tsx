import  {useContext} from 'react'
import {post} from '../types';
import Post from './Post';
import {ProfileContext} from '../index'
import { NavLink } from 'react-router-dom';
import { getAllReadingListPosts } from '../utils/api';
import {useQuery} from 'react-query'


const Home = () => {

  const[userProfile] = useContext(ProfileContext)


    const feedPostsQuery= useQuery({
      enabled: (userProfile?.uid !== undefined) && (userProfile?.uid !== null),
      queryKey: ["homePagePosts", userProfile?.uid],
      queryFn: () => getAllReadingListPosts(userProfile.uid, userProfile.readingList).then((feedposts) => { console.log(feedposts); return feedposts as post[]})
    })

    
    if (feedPostsQuery.isLoading){
      return(<h1>Loading...</h1>)
    }
    else if((feedPostsQuery.data?.length ? feedPostsQuery.data.length : 0 ) === 0){
      return(

    <div>
      <h1>Add books to your reading list to see posts about them here!</h1>
      <NavLink to="search"><h2>Search Books Here</h2></NavLink>
    </div>
      )
    }
  else if(feedPostsQuery.isSuccess) {
    return (<>
      <h1>Posts</h1>
      {feedPostsQuery.data.map((p) => {
        return(
          <Post {...p} key={p.postId}></Post>
        )
      })}
    </>)
  }
  else{return <></>}
}

export default Home
