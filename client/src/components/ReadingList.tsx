import {useState, useContext, useEffect} from 'react'
import {profile, book} from '../types';
import BookThumbnail from './BookThumbnail';
import '../styles/ReadingList.css';
import CommentsSection from './CommentsSection';
import {ProfileContext} from '../index'
import axios from 'axios';
import { NavLink } from 'react-router-dom';


const ReadingList = () => {

  const[userProfile, setUserProfile] = useContext(ProfileContext)
  
  const [isLoading, setIsLoading] = useState(true)
  const [books, setBooks] = useState([] as book[])
  useEffect(() => {

    

      if(userProfile.readingList){
        const readingList = userProfile.readingList;
        setBooks([])
        // for (const bookId of readingList){
        //     axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${import.meta.env.REACT_APP_BOOKS_KEY}`)
        //     .then(({data}) => {setBooks((bl) => [...bl, data]); setIsLoading(false)})
        // }
        const bookList = {books: readingList}
        axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userProfile.uid}/readingList`, bookList)
        .then(({data}) => {setBooks(data.books); setIsLoading(false);})
        
      }
    
}, [userProfile.readingList]);



  
 
  const [view, setView] = useState(0); //0 = ReadingList, 1 = Book Info
  const [currentBook, setCurrentBook] = useState({} as book);
  const addBookToReadingList = () => {
    const updatedUser = {...userProfile, readingList: [...userProfile.readingList, currentBook.id]} as profile;
    setUserProfile(updatedUser);
  }
  const removeBookFromReadingList = () => {
    const updatedUser = {...userProfile, readingList: userProfile.readingList.filter((bookId) => bookId !== currentBook.id)} as profile;
    setUserProfile(updatedUser);
}

  //This function take in a string, s, and removes all pairs of angle brackets and the text between them.
  const removeAngleBrackets = (s:string) => {
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

  const handleEnterBook = (b: book) => {
    setCurrentBook(b);
    setView(1);
}


  if(isLoading){
    return (<h1>Loading...</h1>)
  }

  else if (books.length < 1){
    return (
      <>
        <h1>There are no books in your reading list yet!</h1>
        <NavLink to = "../search"><h2>Search Books Here!</h2></NavLink>
      </>
    )
  }

  else if (view === 0){

    
    return (
      <>
      <h1 className='ReadingListHeader'>Your Reading List</h1>
      <div className='BookSearchResults'>
       {books.map((b) => {
         return(
           <div className='BookSearchResult' key={b.id} onClick={() => handleEnterBook(b)}>
                        
                        <BookThumbnail {...b}/>
                    </div>
                )
              })}
    </div>
      </>
  )
}

else if (view === 1) {
  return(<>
    <div>
            <h1>{currentBook.volumeInfo.title}</h1>
            <img src={currentBook.volumeInfo.imageLinks.smallThumbnail}></img>
            <h3>{currentBook.volumeInfo.authors}</h3>
            <h4>{removeAngleBrackets(currentBook.volumeInfo.description)}</h4>
            <button onClick={() => setView(0)}>Back To Reading List</button>
            {!userProfile.readingList.includes(currentBook.id) &&<button onClick={addBookToReadingList}>Add To Reading List</button>}
            {userProfile.readingList.includes(currentBook.id) &&<button onClick={removeBookFromReadingList}>Remove From Reading List</button>}
            <CommentsSection user={userProfile} book={currentBook}/>
        </div>
  </>)
}
else{
  return(<></>)
}
}

export default ReadingList
