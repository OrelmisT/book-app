import { reply } from "../types"
import {useEffect, useState, useContext} from "react"
import axios from 'axios';
import Reply from "./Reply";
import { ProfileContext } from "../index";
import "../styles/ReplySection.css"





const ReplySection = ({postId}: {postId: string}) => {

    const [profile] = useContext(ProfileContext)

    const [replies, setReplies] = useState([] as reply[])
    const [replyInput, setReplyInput] = useState("");


    useEffect(() => {
        axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${postId}/replies`)
        .then((res) => {setReplies(  res.data.replies);})

        

    }, [])

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


    const handleReplyInput = () => {

        if(replyInput.trim() === "" || replyInput.trim() === ""){
            alert("Please enter a valid title and comment");
            return;
        }  
        const newReply = {
            replyId: (Date.now().toString(36) + Math.random().toString(36)).replace('.', ''),
            postId: postId,
            posterId: profile.uid,
            timestamp: getDateTime(),
            timeStampNum: Date.now(),
            likers: [],
            dislikers: [],
            body: replyInput,
            edited: false
        } as reply;

        
        // fetch(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${props.user.uid}/posts`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify({post: newComment})});
        axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/replies`, newReply)

        setReplyInput("");

        setReplies([ newReply, ...replies]);
    }


    return(
        <div>
        {replies.length === 0 && <h2>No Comments Yet. Be the first!</h2>}
      <div className='ReplySub'>
        <div className='replyInputGroup'>
          <h2>Leave a Reply</h2>   
            <textarea value={replyInput} onChange={(e) => setReplyInput(e.target.value)}></textarea>
        </div>
        <button onClick={handleReplyInput}>Post</button>
      </div>
        {replies.sort((a, b) => {
            const countA = a.dislikers.length - a.likers.length
            const countB = b.dislikers.length - b.likers.length
            return countA - countB
        }).map((r) => {
            return(
                <div>
                    <Reply {...r} key = {r.replyId}/>
                </div>
            )
        })}
    </div>
    )


}

export default ReplySection