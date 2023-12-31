import {useState, useContext, useEffect} from 'react'
import {book} from '../types';
import BookThumbnail from './BookThumbnail';
import '../styles/ReadingList.css';
import {ProfileContext} from '../index'
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';


const ReadingList = () => {

  const nav = useNavigate();

  const[userProfile] = useContext(ProfileContext)
  
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




  const handleEnterBook = (b: book) => {
    nav(`../books/${b.id}`)
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

  // else if (view === 0){

    
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

export default ReadingList
