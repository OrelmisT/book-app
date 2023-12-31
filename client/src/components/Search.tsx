import React, {useState, useEffect} from 'react'
import '../styles/Search.css'
import { book} from '../types'
import BookThumbnail from './BookThumbnail';

import axios from 'axios';
import {useSearchParams, Navigate } from 'react-router-dom';


const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query")



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
            setSearchParams(`query=${searchQuery}`)
            // booksearch(searchQuery);
        }
    }

    const booksearch = (search: string) => {
        
        
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=40&key=${import.meta.env.REACT_APP_BOOKS_KEY}`)
        .then(({data}) => setBooks(data.items));
        
    }

    const [books, setBooks] = useState([] as book[]);

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
    },[query])


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
    </div>
  )}
  else{
    return (
        <Navigate to={`../books/${currentBook.id}`} state= {{book:currentBook}} />
    )
  }
}

export default Search
