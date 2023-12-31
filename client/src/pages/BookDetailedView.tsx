import { useState, useContext, useEffect } from "react"
import {book, profile} from '../types'
import { ProfileContext } from "../index"
import CommentsSection from "../components/CommentsSection"
import { useParams } from "react-router-dom"
import axios from 'axios'
import "../styles/BookDetailedView.css"



const BookDetailedView = () =>{


    const params = useParams() as {bookId: string}
    const bookId = params.bookId
    

    const [book, setBook] = useState({} as book)
    const[userProfile, setUserProfile] = useContext(ProfileContext)

    const defaultImage =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAANlBMVEXz8/PDw8P19fXc3NzAwMDW1tbf39/R0dHt7e3n5+fj4+PHx8fZ2dnw8PDExMTr6+vNzc36+vpMXDVWAAAD9ElEQVR4nO3b7WKqOBSF4bAJhHxBuP+bnZ1gPXR+gXqWMLPePwIqPg0RW6vG9XfMmV7uWK9uc7/oxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urF9zH3iq+8febhPuNWSp+NdxC3iiz3TJwb8fbfkYrszXcMt+RT6Ou54S7f05ybJZdzzWfYl3LKcHu5ruMOL7ndfgN51j6+5ZRyGIbzzwF9yO339Ge7o1ku66aabbrrppptuuummm2666aabbrrppptuuummm2666aab7r/jPvV5n8u4rRvDwcbruK07+Xm2a7htOruLa7hLG8Lbjbf1dcZO/miXmd8VEu53PokVcvxjbddyH//w42Xcti5M8XbzxLZXknudT3ybHuZu529jmruchX/dXQHaHE7ME239unvaziO2K+5M8dvz5JXfwB/nw6+6X4d/2W1kOfc1gWdfduupexrTcL4vfj72KX+pdx7x//69I3B0Y6MbG93Y6MZGNza6sf3n3T9v2Eh7j8dsF/LcbvZb/73Z1LcpZLdsfl0nz6vM4V/Kj7plirMXk+M8iqRe+l4kxjnLMke3PWSIkrzohnmRPMd526+kWO8muV7Ud5ylTHrXttO2bmIserP210/uYjwGP+x2YSkqTsbW752vRYVdHeGlrNG3AQt20QeX4n2pumXbrZSYjXTZO9GfLOk1Ud3d4yet/6joVqd3c80d10+Ptw5t1fi6YOza6cocQnVPCmkK55ICrEp2bhPrRueTHqdBD8ne3dZNF+qWzd2Fg390HnZ3T3c9zG1IZx19WToXH/OkL3W8rezdemz6QWRMbXYsndm767pUt3+608GzxGF3nMzY9m7rQDm9U50n0ubJY7z7sVPAnPO8c/dFfy6ZShvZQZ8jD3e9thvqFJvXcWh7lr8xT1JxuncfhzrS3qpKbEqTLHHdiDqmos8zSa60Wfxwl2W1dYLr9PZuTUnaAetSynVdj4WxYxtvp0/qrLv8rFuHsx5I8WNbC3WLDyGb7MXntm1a2tLPDbeN4tuieD0megO99bZanxrbuglhqs/vdhE+Pb//nGC3lW15OxX/3F/M7iZ/Nv46cz9Xd+u/zuIfnidXi25sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6MbG93Y6MZGNza6sdGNjW5sdGOjGxvd2OjGRjc2urHRjY1ubHRjoxsb3djoxkY3Nrqx0Y2Nbmx0Y6Mb263dd6w3rr9j7h/3zUS3bCmkjAAAAABJRU5ErkJggg==";


    const removeBookFromReadingList = () => {
        const updatedUser = {...userProfile, readingList: userProfile.readingList.filter((bookId) => bookId !== book.id)} as profile;
        setUserProfile(updatedUser);
    }

    const addBookToReadingList = () => {
        const updatedUser = {...userProfile, readingList: [...userProfile.readingList, book.id]} as profile;
        setUserProfile(updatedUser);

    }


    useEffect(() => {
        
            axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${import.meta.env.REACT_APP_BOOKS_KEY}`)
            .then(({data}) => {setBook(data)})
        
    })


    const removeAngleBrackets = (s:string) => {
        if(s === null || s === undefined){
            return ""
        }
        let result = "";
        let i = 0;
        while(i < s.length){
          if(s[i] === '<'){
            while(s[i] !== '>'){
              i++;
            }
          }
          else{
            result += s[i];
          }
          i++;
        }
        return result;
      }

   if (book === null && book === undefined){
    return <></>
   }

   else{

       
       
       return (
           <>
           <div className="book-info">
              <h1>{book.volumeInfo?.title}</h1>
              <img src={book.volumeInfo?.imageLinks?.smallThumbnail ? book.volumeInfo?.imageLinks?.smallThumbnail : defaultImage}></img>
              <h3>{book.volumeInfo?.authors}</h3>
              <h4>{removeAngleBrackets(book.volumeInfo?.description)}</h4>
           </div>
            {userProfile.readingList ? (!userProfile.readingList.includes(book.id) &&<button onClick={addBookToReadingList}>Add To Reading List</button>) : <></>}
            {userProfile.readingList ? (userProfile.readingList.includes(book.id) &&<button onClick={removeBookFromReadingList}>Remove From Reading List</button>) : <></>}
            <CommentsSection user={userProfile} book={book}/>
        </>
    )
}
} 

export default BookDetailedView