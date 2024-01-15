import {useContext} from 'react'
import {book} from '../types';
import BookThumbnail from './BookThumbnail';
import '../styles/ReadingList.css';
import {ProfileContext} from '../index'
import { NavLink, useNavigate } from 'react-router-dom';
import { getBook} from '../utils/api';
import { useQueries } from 'react-query';

const ReadingList = () => {

  const nav = useNavigate();


  const[userProfile] = useContext(ProfileContext)
  const bookListQuery = useQueries((
    userProfile.readingList !== undefined && userProfile.readingList !== null?
    
    userProfile.readingList.map((bookId) => ({
      enabled: (userProfile !== undefined) && (userProfile!== undefined) ,
      queryKey: ["books", bookId],
      queryFn: () => getBook(bookId).then((fetchedBook) => fetchedBook),
      staleTime: Infinity
    }))
    : []
    )
  )
   

  const handleEnterBook = (b: book) => {
    nav(`../books/${b.id}`)
}


  if(bookListQuery.some((query) => query.isLoading)){
    return (<h1>Loading...</h1>)
  }

  else if (bookListQuery?.length  < 1){
    return (
      <>
        <h1>There are no books in your reading list yet!</h1>
        <NavLink to = "../search"><h2>Search Books Here!</h2></NavLink>
      </>
    )
  }
    
  return (
      <>
      <h1 className='ReadingListHeader'>Your Reading List</h1>
      <div className='BookSearchResults'>
       { bookListQuery !== undefined && bookListQuery !== null ? bookListQuery.map((bQuery) => {
         return(
           <div className='BookSearchResult' key={bQuery.data.id} onClick={() => handleEnterBook(bQuery.data)}>
                        
                        <BookThumbnail {...bQuery.data}/>
                    </div>
                )
              }): <></>}
    </div>
      </>
  )
}

export default ReadingList
