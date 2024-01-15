import { post, profile } from '../types'
import '../styles/Post.css'
import { useNavigate} from 'react-router-dom'
import { getUser } from '../utils/api'
import { useQuery } from 'react-query'

const Post = (props:post) => {
  const nav = useNavigate()

  //Fetch user data for up-to-date user display name

  const userQuery = useQuery({
    queryFn: () =>  getUser(props.userId).then((fetchedUser) => fetchedUser),
    enabled: (props.userId !== undefined) && (props.userId !== null),
    queryKey: ["users", props.userId],
    initialData: {} as profile
  })

  return (
    <>
      <div className='postThumbnail'>
          <div className='BookThumbnail' onClick={() => nav(`/home/books/${props.bookId}`)}>
            <h2>{props.bookTitle}</h2>
            <img src={props.bookThumbnail} alt={props.bookTitle}/>
          </div>
      
            <div className='commentContents' onClick={ () => nav(`/home/posts/${props.postId}`)}>
              <div className='theComment'>

                <h2>{props.title}</h2>
              
                <h3>{props.body}</h3>
              </div>

              <div className='userInfo'>
                <h4>{`${userQuery?.data?.displayName} : ${props.timestamp}`}</h4>
              </div>
            </div>
        
      </div>

      
    </>
  )
}

export default Post
