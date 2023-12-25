import {useEffect, useState} from 'react'
import {book, post, profile} from '../types'
import Post from './Post';
import '../styles/CommentsSection.css'
import axios from 'axios';

const CommentsSection = (props: {user: profile, book:book}) => {

    const [bookComments, setBookComments] = useState([] as post[]);
    const [commentInput, setCommentInput] = useState("");
    const [titleInput, setTitleInput] = useState("");

    //Returns a time stamp in the format: "MM/DD/YYYY HH:MM AM/PM timezone"
    const getDateTime = () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const ampm = date.getHours() > 12 ? "PM" : "AM";
        return `${month}/${day}/${year} ${hours}:${minutes} ${ampm} UTC${date.getTimezoneOffset() / 60}`;
    }

    useEffect( () => {
      //gather all comments for this book
      // fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${props.book.id}`).then(res => res.json()).then((data) => {
      //   setBookComments(data.posts);
      // });

      axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${props.book.id}`)
      .then(({data}) => setBookComments(data.posts));

    }, 
    []);

    const handleCommentInput = () => {

        if(commentInput.trim() === "" || titleInput.trim() === ""){
            alert("Please enter a valid title and comment");
            return;
        }  
        const newComment = {
            postId: Date.now().toString(36) + Math.random().toString(36),
            bookTitle: props.book.volumeInfo.title,
            title: titleInput,
            body: commentInput,
            bookId: props.book.id,
            userId: props.user.uid,
            userDisplayName: props.user.displayName,
            timestamp: getDateTime(),
            timeStampNum: Date.now(),
            bookThumbnail: props.book.volumeInfo?.imageLinks?.smallThumbnail ? props.book.volumeInfo?.imageLinks?.smallThumbnail : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAANlBMVEXz8/PDw8P19fXc3NzAwMDW1tbf39/R0dHt7e3n5+fj4+PHx8fZ2dnw8PDExMTr6+vNzc36+vpMXDVWAAAD9ElEQVR4nO3b7WKqOBSF4bAJhHxBuP+bnZ1gPXR+gXqWMLPePwIqPg0RW6vG9XfMmV7uWK9uc7/oxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urF9zH3iq+8febhPuNWSp+NdxC3iiz3TJwb8fbfkYrszXcMt+RT6Ou54S7f05ybJZdzzWfYl3LKcHu5ruMOL7ndfgN51j6+5ZRyGIbzzwF9yO339Ge7o1ku66aabbrrppptuuummm2666aabbrrppptuuummm2666aab7r/jPvV5n8u4rRvDwcbruK07+Xm2a7htOruLa7hLG8Lbjbf1dcZO/miXmd8VEu53PokVcvxjbddyH//w42Xcti5M8XbzxLZXknudT3ybHuZu529jmruchX/dXQHaHE7ME239unvaziO2K+5M8dvz5JXfwB/nw6+6X4d/2W1kOfc1gWdfduupexrTcL4vfj72KX+pdx7x//69I3B0Y6MbG93Y6MZGNza6sf3n3T9v2Eh7j8dsF/LcbvZb/73Z1LcpZLdsfl0nz6vM4V/Kj7plirMXk+M8iqRe+l4kxjnLMke3PWSIkrzohnmRPMd526+kWO8muV7Ud5ylTHrXttO2bmIserP210/uYjwGP+x2YSkqTsbW752vRYVdHeGlrNG3AQt20QeX4n2pumXbrZSYjXTZO9GfLOk1Ud3d4yet/6joVqd3c80d10+Ptw5t1fi6YOza6cocQnVPCmkK55ICrEp2bhPrRueTHqdBD8ne3dZNF+qWzd2Fg390HnZ3T3c9zG1IZx19WToXH/OkL3W8rezdemz6QWRMbXYsndm767pUt3+608GzxGF3nMzY9m7rQDm9U50n0ubJY7z7sVPAnPO8c/dFfy6ZShvZQZ8jD3e9thvqFJvXcWh7lr8xT1JxuncfhzrS3qpKbEqTLHHdiDqmos8zSa60Wfxwl2W1dYLr9PZuTUnaAetSynVdj4WxYxtvp0/qrLv8rFuHsx5I8WNbC3WLDyGb7MXntm1a2tLPDbeN4tuieD0megO99bZanxrbuglhqs/vdhE+Pb//nGC3lW15OxX/3F/M7iZ/Nv46cz9Xd+u/zuIfnidXi25sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6Mb263dd6w3rr9j7h/3zUS3bCmkjAAAAABJRU5ErkJggg==",
            likers: [],
            dislikers: [],
            edited: false
        } as post;

        
        // fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${props.user.uid}/posts`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify({post: newComment})});
        axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${props.user.uid}/posts`, {post: newComment})

        setCommentInput("");
        setTitleInput("");

        setBookComments([ newComment, ...bookComments]);
    }


  return (
    <div>
        <h1>Posts</h1>

        {bookComments.length === 0 && <h2>No Comments Yet. Be the first!</h2>}
      <div className='CommentSub'>
        <div className='commentInputGroup'>
          <h2>Leave a Comment</h2>
          <h4>Title</h4>
          <input type='text' value={titleInput} onChange={(e) => setTitleInput(e.target.value)}></input>
          <h4>Comment</h4>
            <textarea value={commentInput} className="commentInput" onChange={(e) => setCommentInput(e.target.value)}></textarea>
        </div>
        <button onClick={handleCommentInput}>Post</button>
      </div>
        {bookComments.map((c) => {
            return(
                <div>
                    <Post {...c} key = {c.postId}/>
                </div>
            )
        })}
    </div>
  )
}

export default CommentsSection
