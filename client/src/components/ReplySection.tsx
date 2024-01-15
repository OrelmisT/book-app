import { reply } from "../types"
import {useEffect, useState, useContext} from "react"
import axios from 'axios';
import Reply from "./Reply";
import { ProfileContext } from "../index";
import "../styles/ReplySection.css"
import { getPostReplies } from "../utils/api";
import { TiArrowSortedDown } from "@react-icons/all-files/ti/TiArrowSortedDown";





const ReplySection = ({postId}: {postId: string}) => {

    const [inputIsOpen, setInputIsOpen] = useState(false);

    const [profile] = useContext(ProfileContext)

    const [replies, setReplies] = useState([] as reply[])
    const [replyInput, setReplyInput] = useState("");


    useEffect(() => {
        const getReplies = async () =>{
            const replies = await getPostReplies(postId);
            setReplies(replies)
        }

        getReplies()

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

        if(replyInput.length >  10000){  
            alert("10,000 Character Limit")
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

        
        axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/replies`, newReply)

        setReplyInput("");

        setReplies([ newReply, ...replies]);
    }


    return(
        <div>
      <div className='ReplySub'>
        <div id="expand">
            <TiArrowSortedDown id={'expandButtonHover'} className={inputIsOpen ? 'expandActive' : 'expandInactive'} onClick={() => setInputIsOpen((prev) => !prev)} />
        </div>
        <h2 >Leave a Reply</h2> 
        <div className={`${inputIsOpen? 'active' : 'inActive'}`}>

                <div className='replyInputGroup'>
                    <textarea value={replyInput} onChange={(e) => setReplyInput(e.target.value)} className="replyInput"></textarea>
                </div>
                <button onClick={handleReplyInput}>Post</button>
        </div>
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