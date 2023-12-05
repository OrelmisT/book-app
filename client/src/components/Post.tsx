import { post } from '../types'
import '../styles/Post.css'

const Post = (props:post) => {
  return (
    <div className='postThumbnail'>
        <div className='BookThumbnail'>
          <h2>{props.bookTitle}</h2>
          <img src={props.bookThumbnail} alt={props.bookTitle}/>
        </div>
        <div className='commentContents'>
          <h2>{props.title}</h2>
        
          <h3>{props.body}</h3>
       
          <h4>{`${props.userDisplayName} : ${props.timestamp}`}</h4>
        </div>
      
    </div>
  )
}

export default Post
