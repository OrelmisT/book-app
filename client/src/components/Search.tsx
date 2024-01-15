import React, {useState, useEffect} from 'react'
import '../styles/Search.css'
import { book} from '../types'
import BookThumbnail from './BookThumbnail';

import {useSearchParams, Navigate } from 'react-router-dom';
import { bookSearchApi } from '../utils/api';


const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query")
    const startIndex = searchParams.get('startIndex')
    const [queryState] = useState(query)
    const [startIndexState] = useState(startIndex)



    const [currentBook, setCurrentBook] = useState({} as book);
    const [view, setView] = useState(0); //0 = Search, 1 = Book Info



    const handleEnterBook = (b: book) => {
        setCurrentBook(b);
        setView(1);
    }

    const handleEnter = (e:React.KeyboardEvent<HTMLInputElement>) =>{
        //check if searchQuery is only spaces

        if(e.key === 'Enter'){
            if(searchQuery.trim() === ""){
                alert("Please enter a valid search query")
                return;
            }
            
            // redirect(`search?query=${searchQuery}`)
            setSearchParams(`query=${searchQuery}&startIndex=${0}`)
            // booksearch(searchQuery);
        }
    }

    const [books, setBooks] = useState([] as book[]);

    const booksearch = async (search: string) => {
        const bookQueryResults = await bookSearchApi(search, startIndex);
        console.log(bookQueryResults)

        setBooks(bookQueryResults.items)
        window.scrollTo(0,0); 
    }

    

    const [searchQuery, setQuery] = useState("");


    //Fetch book results 
    useEffect(() =>{
        const query = searchParams.get("query")
        if(query !== null && query !== undefined){
            booksearch(query);
        }
        else{
            setBooks([]);
        }
    },[query, searchParams, startIndex, queryState, startIndexState])

  

    if (view === 0){

  return (
    <div>
        <h1 className='SearchHeader'>Search Books</h1>
        <input type="text" value={searchQuery} onChange={(e) => setQuery(e.target.value)} placeholder="Search" onKeyDown={ (e) => handleEnter(e)} />
        <div className='BookSearchResults'>
            {books.map((b) => {
                return(
                    <div className='BookSearchResult' key={b.id} onClick={() =>handleEnterBook(b)}>
                        <BookThumbnail {...b}/>
                    </div>
                )
            })}
        </div>

        {(startIndex !== undefined && startIndex !== null && books.length !== 0) ?
            <div className='resultNav'>
                <button disabled={Number(startIndex) === 0} onClick={ () => setSearchParams(`query=${searchQuery}&startIndex=${Number(startIndex) - 15}`)}>prevPage</button>
                {startIndex? Number(startIndex)/15 + 1:<></>}
                <button onClick={ () => setSearchParams(`query=${searchQuery}&startIndex=${Number(startIndex) + 15}`)}>nextPage</button>

            </div>
        
        : <></>}
    </div>
  )}
  else{
    return (
        <Navigate to={`../books/${currentBook.id}`} state= {{book:currentBook}} />
    )
  }
}

export default Search
