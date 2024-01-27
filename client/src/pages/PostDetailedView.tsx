import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate} from "react-router-dom"
import { post, profile } from "../types"
import '../styles/PostDetailedView.css'
import { ProfileContext } from "../index"
import ReplySection from "../components/ReplySection"
import { getUser, getPost, updatePost, deletePost, updatePostLikes } from "../utils/api"
import { AiFillLike } from "@react-icons/all-files/ai/AiFillLike";
import { AiOutlineLike } from "@react-icons/all-files/ai/AiOutlineLike";
import { AiFillDislike } from "@react-icons/all-files/ai/AiFillDislike";
import {AiOutlineDislike} from "@react-icons/all-files/ai/AiOutlineDislike"
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";


const PostDetailedView = () => {
    const [user] = useContext(ProfileContext)
    const nav = useNavigate()
    const [profile]  = useContext(ProfileContext)
    const [isLiked, setLiked] = useState(false);
    const [isDisliked, setDisliked] = useState (false);
    const [likersList, setLikersList] = useState([] as string[]);
    const [disLikersList, setDislikersList] = useState([] as string[]);
    const {postId}= useParams()
    const [postInfo, setPostInfo] = useState({} as post)
    const [posterInfo, setPosterInfo] = useState({} as profile)
    const [isLoading, setIsLoading] = useState(true)
    const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAANlBMVEXz8/PDw8P19fXc3NzAwMDW1tbf39/R0dHt7e3n5+fj4+PHx8fZ2dnw8PDExMTr6+vNzc36+vpMXDVWAAAD9ElEQVR4nO3b7WKqOBSF4bAJhHxBuP+bnZ1gPXR+gXqWMLPePwIqPg0RW6vG9XfMmV7uWK9uc7/oxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urF9zH3iq+8febhPuNWSp+NdxC3iiz3TJwb8fbfkYrszXcMt+RT6Ou54S7f05ybJZdzzWfYl3LKcHu5ruMOL7ndfgN51j6+5ZRyGIbzzwF9yO339Ge7o1ku66aabbrrppptuuummm2666aabbrrppptuuummm2666aab7r/jPvV5n8u4rRvDwcbruK07+Xm2a7htOruLa7hLG8Lbjbf1dcZO/miXmd8VEu53PokVcvxjbddyH//w42Xcti5M8XbzxLZXknudT3ybHuZu529jmruchX/dXQHaHE7ME239unvaziO2K+5M8dvz5JXfwB/nw6+6X4d/2W1kOfc1gWdfduupexrTcL4vfj72KX+pdx7x//69I3B0Y6MbG93Y6MZGNza6sf3n3T9v2Eh7j8dsF/LcbvZb/73Z1LcpZLdsfl0nz6vM4V/Kj7plirMXk+M8iqRe+l4kxjnLMke3PWSIkrzohnmRPMd526+kWO8muV7Ud5ylTHrXttO2bmIserP210/uYjwGP+x2YSkqTsbW752vRYVdHeGlrNG3AQt20QeX4n2pumXbrZSYjXTZO9GfLOk1Ud3d4yet/6joVqd3c80d10+Ptw5t1fi6YOza6cocQnVPCmkK55ICrEp2bhPrRueTHqdBD8ne3dZNF+qWzd2Fg390HnZ3T3c9zG1IZx19WToXH/OkL3W8rezdemz6QWRMbXYsndm767pUt3+608GzxGF3nMzY9m7rQDm9U50n0ubJY7z7sVPAnPO8c/dFfy6ZShvZQZ8jD3e9thvqFJvXcWh7lr8xT1JxuncfhzrS3qpKbEqTLHHdiDqmos8zSa60Wfxwl2W1dYLr9PZuTUnaAetSynVdj4WxYxtvp0/qrLv8rFuHsx5I8WNbC3WLDyGb7MXntm1a2tLPDbeN4tuieD0megO99bZanxrbuglhqs/vdhE+Pb//nGC3lW15OxX/3F/M7iZ/Nv46cz9Xd+u/zuIfnidXi25sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6Mb263dd6w3rr9j7h/3zUS3bCmkjAAAAABJRU5ErkJggg=="

    //0 = Regular view. 1 == Editing Post. 3 == Deletion Confirmation Screen
    const [view, setView] = useState(0); 
    const [commentInput, setCommentInput] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [postIsExpanded, setPostIsExpanded] = useState(false);

    
    const handleCommentInput = () =>{
        const editedPost = {...postInfo, body: commentInput, title: titleInput, edited: true}
        setPostInfo({...editedPost, likers: likersList, dislikers: disLikersList})
        updatePost(editedPost)
        setView(0)
    }

    const handleCancel = () =>{
            setCommentInput(postInfo.body)
            setTitleInput(postInfo.title)
            setView(0)
        }

    const handleDelete = async () => {
        await deletePost(postInfo.postId)
        nav("..")

    }
    
    const updateLikeDislike = async (likeState:boolean, dislikeState:boolean)  => {

        await updatePostLikes(postInfo.postId, {like: likeState, dislike: dislikeState, userId: profile.uid})

    }
    
    
    const handleDislike = async () => {

        if(isDisliked){
            //If already disliked, remove dislike
            setDisliked(false)
            //Remove from dislikers list
            setDislikersList((prev) => prev.filter((id) => id !== profile.uid))

            updateLikeDislike(false, false)
            
        }
        else {
            if(isLiked){
                // Remove Like 
                setLiked(false)
                //remove from likers list
                setLikersList((prev) => prev.filter((id) => id !== profile.uid))
            }

            //Add dislike
            setDisliked(true)
            //add to dislikers list
            setDislikersList((prev) => [...prev, profile.uid])
            updateLikeDislike(false, true);
        }
    }

    const handleLike = () => {
        if(isLiked){
            //If already is liked, remove like
            setLiked(false)
            //Remove from likersList 
            setLikersList((prev) => prev.filter((id) => id !== profile.uid))

            updateLikeDislike(false, false);

        }
        else{
            if(isDisliked){
                //Remove dislike
                setDisliked(false)
                //Remove from dislike list
                setDislikersList((prev) => prev.filter((id) => id !== profile.uid))
            }
            //Add like
            setLiked(true)
            //Add to likers list 
            setLikersList((prev) => [...prev, profile.uid])

            updateLikeDislike(true, false)

        }
    } 


    useEffect( () => {

        //HERE
        const getPostInfo = async () =>{
            const postData =  await getPost(postId || '');
            setPostInfo(postData);
            setCommentInput(postData.body)
            setTitleInput(postData.title) 

        }

        getPostInfo()

    }, [])


    useEffect(() => {
        if(postInfo.likers !== null && postInfo.likers !== undefined){
            setLikersList(postInfo.likers)
            if(postInfo.likers.includes(profile.uid)){
                setLiked(true)
            }
        }
        if(postInfo.dislikers !== null && postInfo.dislikers !== undefined){
            setDislikersList(postInfo.dislikers)
            if(postInfo.dislikers.includes(profile.uid)){
                setDisliked(true)
            }
        }

    }, [postInfo, postInfo.likers, postInfo.dislikers, profile.uid])

    useEffect(  () => {
        if (postInfo.userId !== null && postInfo.userId !== undefined){
            
            const getUserInfo = async () =>{

                console.log('here')
                const userInfo = await getUser(postInfo.userId);
                
                setPosterInfo(userInfo);
                setIsLoading(false)
            }

            getUserInfo();
        }
    }, [postInfo])


    //Add in another use effect here to fetch all of the replies to this posFt


    if (isLoading){
        return <h2>Loading...</h2>
    }
    else if(view === 0) return(
        <>
            <div className="post">

                <div className="bookthumb" onClick={() => nav(`../books/${postInfo.bookId}`)}>
                    <h2>{postInfo.bookTitle}</h2>
                    <img src={postInfo.bookThumbnail ? postInfo.bookThumbnail : defaultImage}></img>

                </div>

                <div className="postconts">
                    <div className="post-text">
                        <h2>{postInfo.title}</h2>
                        <div className={`post-body ${(!postIsExpanded && postInfo.body.length > 1500) && 'post-collapsed'}`}>
                            <h4>{postInfo.body}</h4>
                        </div>
                    </div>
                    {(!postIsExpanded && postInfo.body.length > 1500) && <h6 className="expand-collapse-buttons" onClick={() => setPostIsExpanded(true)}>See More</h6>}
                    {(postIsExpanded && postInfo.body.length > 1500) && <h6 className="expand-collapse-buttons" onClick={() => setPostIsExpanded(false)}>See Less</h6>}
                    <div className="post-user-info">
                     <div id="postPFP" style={{backgroundImage: `url(${posterInfo.photoURL})`}} onClick={() => nav(`../users/${posterInfo.uid}`)} className="pointerOnHover"></div>
                     {/* <img src={posterInfo.photoURL} onClick={() => nav(`../users/${posterInfo.uid}`)} className="pointerOnHover"></img>  */}
                     <p><span onClick={() => nav(`../users/${posterInfo.uid}`)} className="underLineOnHover">{posterInfo.displayName}</span> {postInfo.timestamp}{postInfo.edited ? ' (edited)' : ""} {user.uid === postInfo.userId? "|" : ""} <span className="underLineOnHover" onClick={() => setView(1)}> {user.uid === postInfo.userId? <AiFillEdit/> : ""}</span> {user.uid === postInfo.userId? "|" : ""} <span className="underLineOnHover" onClick={() => setView(3)}> {user.uid === postInfo.userId? <MdDelete/> : ""} </span></p>  
                    </div>

                </div>
                <div className="likes">
                    <div>
                        {isLiked? <AiFillLike onClick={() => handleLike()} className="pointerOnHover"/> : <AiOutlineLike onClick={() => handleLike()} className="pointerOnHover"/>}
                    </div>
                    {likersList.length - disLikersList.length}
                    <div>
                        {isDisliked? <AiFillDislike onClick={() => handleDislike()} className="pointerOnHover"/> : <AiOutlineDislike onClick={() => handleDislike()} className="pointerOnHover"/>}
                    </div>
                </div>

            </div>
            <div className="replies">

                <ReplySection postId={postId ? postId : ''}/>
                
            </div>
        </>
        )
    else if (view === 1) return(
        <div className='CommentSub'>
        <div className='commentInputGroup'>
          <h2>Edit Post</h2>
          <h4>Title</h4>
          <input type='text' value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="titleEditInput"></input>
          <h4>Comment</h4>
            <textarea value={commentInput} className="commentInput" onChange={(e) => setCommentInput(e.target.value)}></textarea>
        </div>
        <div className="spacedButtons">
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleCommentInput}>Save</button>
        </div>
      </div>
    )
    else if (view === 3)return (
        <>
        <div className='CommentSub'>
            <h2>Are you sure you want to delete your post? This cannot be undone.</h2>
            <div className="spacedButtons">
                <button onClick={() => setView(0)}>Cancel</button>
                <button onClick={() => handleDelete()}>Confirm</button>

            </div>
        </div>
        </>
    )
    else return <></>
    




}


export default PostDetailedView