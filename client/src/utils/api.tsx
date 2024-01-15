import axios from 'axios'
import { profile, post } from '../types'

//Export all data fetch operations from here

//get a user profile via userId
export const getUser = async(userId: string) => {

    try{
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}` )
        const user:profile = res.data.userInfo
        return user
    }
    catch(error){
        throw{message: "Something went wrong while trying to fetch the user"}
    }

}


//get all the replies for a post
export const getPostReplies = async(postId: string) => {
    try{
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${postId}/replies`)
        const replies = res.data.replies
        return replies 

    }
    catch(error){
        throw({message: "Something went wrong while trying to fetch replies for this post"})
    }
}


//Get a post by id
export const getPost = async(postId: string) => {
    try {
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/user-posts/${postId}`)
        return res.data.postInfo
    } 
    catch(error){
            throw({message: "Something went wrong while trying to fetch this post"})
    }


}

//update post
export const updatePost = async(editedPost:post) =>{
    try{
        axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${editedPost.postId}`, {editedPost})
    }
    catch(error){
        throw({message: "Something went wrong while trying to update the post"})
    }
}

//delete post
export const deletePost = async(postId:string) => {
    try{
        axios.delete(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${postId}`)

    }
    catch(error){
        throw({message: "Something went wrong while trying to delete the post"})
    }
}

//update post likes
export const updatePostLikes = async(postId: string, likeDislikeInfo:{like: boolean; dislike: boolean; userId: string}) => {
    try{
        axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${postId}/likes`, likeDislikeInfo)
    }
    catch(error){
        throw({message: "Something went wrong while trying to udpate the likes of the post"})
    }

}


//Get all posts for a the books in the user's reading list
export const getAllReadingListPosts = async(userId: string, bookList: string[]) => {
    try{
        const res = await axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}/readingListPosts`, {bookList})
        return res.data.posts

    }
    catch(error){
        throw({message: "Something went wrong while trying to fetch main feed posts"})
    }
}

export const deleteUserProfile = async(userId:string) => {
    try{
        axios.delete(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}`)

    }
    catch(error){
        throw({message: "Something went wrong while trying to delete the User"})
    }
}

export const getUserPosts = async(userId:string) => {
    try{
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}/posts`)
        return res.data.posts

    }
    catch(error){
        throw({message: "Something went wrong whil trying to fetch the user's postss"})
    }
}

export const getUserReplies = async(userId:string) => {
    try{
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}/replies`)
        return res.data.replies

    }
    catch(error){
        throw({message: "Something went wrong whil trying to fetch the user's postss"})
    }
}


//fix this api design
export const getBookPosts = async (bookId: string) =>{
    try{
        const res = await axios.get(`${import.meta.env.REACT_APP_BACKEND_ROOT}/posts/${bookId}`)
        return res.data.posts

    }
    catch(error){
        throw({message: "Something went wrong while trying to fetch posts for this book."})
    }
}

export const createPost = async (userId: string, newPost: post) => {
    try{
        axios.post(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}/posts`, {post: newPost})
    }
    catch(error){
        throw({message: "Something went wrong while trying to create this new post"})
    }
}

export const getReadingList = async(userId: string, bookList: {books: string[]}) =>{
    try{
        console.log('fetch da book')
        const res = await axios.put(`${import.meta.env.REACT_APP_BACKEND_ROOT}/users/${userId}/readingList`, bookList)
        const books = res.data.books
        return books
    }
    catch(error){
        throw({message: "Something went wrong while trying to update the User's reading list"})
    }
}

export const getBook = async(bookId: string) => {
    try{
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${import.meta.env.REACT_APP_BOOKS_KEY}`)
        return res.data
    }
    catch(error){
        throw {message: "Something went wrong while trying to fetch this book"}
    }
}

export const bookSearchApi = async(query: string, startIndex: string | null) => {
    try{
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=15&startIndex=${startIndex}&key=${import.meta.env.REACT_APP_BOOKS_KEY}`)
        const books = res.data
        return books
    }
    catch(error){
        throw({message: "Something wen wrong while executing this book query"})
    }
}