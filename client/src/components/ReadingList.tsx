import React, {useState} from 'react'
import {profile, book} from '../types';
import BookThumbnail from './BookThumbnail';
import '../styles/ReadingList.css';
import CommentsSection from './CommentsSection';


const ReadingList = (props:{books: book[], user:profile, setUserProfile: React.Dispatch<React.SetStateAction<profile>>}) => {
  const [view, setView] = useState(0); //0 = ReadingList, 1 = Book Info
  const [currentBook, setCurrentBook] = useState({} as book);
  const addBookToReadingList = () => {
    const updatedUser = {...props.user, readingList: [...props.user.readingList, currentBook.id]} as profile;
    props.setUserProfile(updatedUser);
  }
  const removeBookFromReadingList = () => {
    const updatedUser = {...props.user, readingList: props.user.readingList.filter((bookId) => bookId !== currentBook.id)} as profile;
    props.setUserProfile(updatedUser);
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



  if (view === 0){

    
    return (
      <>
      <h1 className='ReadingListHeader'>Your Reading List</h1>
      <div className='BookSearchResults'>
       {props.books.map((b) => {
         return(
           <div className='BookSearchResult' onClick={() => handleEnterBook(b)}>
                        
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
            {!props.user.readingList.includes(currentBook.id) &&<button onClick={addBookToReadingList}>Add To Reading List</button>}
            {props.user.readingList.includes(currentBook.id) &&<button onClick={removeBookFromReadingList}>Remove From Reading List</button>}
            <CommentsSection user={props.user} book={currentBook}/>
        </div>
  </>)
}
else{
  return(<></>)
}
}

export default ReadingList
