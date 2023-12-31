import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate} from "react-router-dom"
import { post, profile } from "../types"
import axios from "axios"
import '../styles/PostDetailedView.css'
import { ProfileContext } from ".."
import ReplySection from "../components/ReplySection"

const PostDetailedView = () => {
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

    const updateLikeDislike = async (likeState:boolean, dislikeState:boolean)  => {
        await axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${postInfo.postId}/likes`
        , {like: likeState, dislike: dislikeState, userId: profile.uid})

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

        axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/user-posts/${postId}`)
        .then(({data}) => {
            setPostInfo(data.postInfo)
            
        })



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

    }, [postInfo])

    useEffect(() => {
        if (postInfo.userId !== null && postInfo.userId !== undefined){
            
            axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${postInfo.userId}`)
            .then(({data}) => {setPosterInfo(data.userInfo)});
            setIsLoading(false)
        }
    }, [postInfo])


    //Add in another use effect here to fetch all of the replies to this post


    if (isLoading){
        return <h2>Loading...</h2>
    }
    return(
        <>
            <div className="post">

                <div className="bookthumb" onClick={() => nav(`../books/${postInfo.bookId}`)}>
                    <h2>{postInfo.bookTitle}</h2>
                    <img src={postInfo.bookThumbnail ? postInfo.bookThumbnail : defaultImage}></img>

                </div>

                <div className="postconts">
                    <div className="post-text">
                        <h2>{postInfo.title}</h2>
                        <h4>{postInfo.body}</h4>
                    </div>
                    <div className="post-user-info">
                     <img src={posterInfo.photoURL}></img> 
                     <p>{`${posterInfo.displayName} ${postInfo.timestamp}`}</p>  
                    </div>

                </div>
                <div className="likes">
                    <button onClick={() => handleLike()} className={isLiked ? 'enabled' : ''}>^</button>
                    {likersList.length - disLikersList.length}
                    <button onClickCapture={() => handleDislike()} className={isDisliked ? 'enabled': ''}>v</button>
                </div>

            </div>
            <div className="replies">

                <ReplySection postId={postId ? postId : ''}/>
                
            </div>
        </>
        )
    




}


export default PostDetailedView