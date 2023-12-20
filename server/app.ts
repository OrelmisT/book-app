import express, { Express } from "express";
import cors from "cors";

import { post, profile, book} from './types';
import { signUp, updateUser, deleteUser} from "./people.controller";
import { createPost, getUserPosts, getBookPosts, getUserReadingListPosts, deleteUserPosts } from "./post.controller";
import axios from 'axios';


const app: Express = express();
const port = 8080;




app.use(cors());
app.use(express.json());



app.get("/", async (req:any, res:any) => {
    res.status(200).json({
        message: "Hello World!"
    });
});


//SignUp - or sign in 
app.post("/users/:uid", async (req:any, res:any) => {

    
    

    const person:profile = req.body.person;

    const uid = req.params.uid;

    try {

        const newProfile = await signUp(uid, person);
        res.status(200).json(newProfile);
        
    } catch (error) {
        res.status(500).json({
            error: `Something went wrong during signup.`
        })

}});


//Update the User's Profile 
app.put("/users/:uid", async (req:any, res:any) => {
    
        const person:profile = req.body;
        const uid = req.params.uid;
    
        try {
    
            const newProfile = await updateUser(uid, person);
            res.status(200).json(newProfile);
            
        } catch (error) {
            res.status(500).json({
                error: `Something went wrong during user update`
            })
    
    }}
);


//Delete a user
app.delete("/users/:uid", async (req:any, res:any) => {
    const uid = req.params.uid;
    try {
        const deletedProfile = await deleteUser(uid);
        deleteUserPosts(uid);
        res.status(200).json(deletedProfile);
    } catch(error) {
        res.status(500).json({
            error: `Something went wrong during user deletion`
        })
    }
});


//Create a post
app.post("/users/:uid/posts", async (req:any, res:any) => {
    const post: post = req.body.post;
   
    try {
        const newPost = await createPost(req.params.uid, post);
        res.status(200).json(newPost);
    } catch(error) {
        res.status(500).json({
            error: `Something went wrong during post creation`
        })
    }
});

//Get User's posts
app.get("/users/:uid/posts", async (req:any, res:any) => {
    const uid = req.params.uid;
    try {
        const posts = await getUserPosts(uid);
        res.status(200).json({posts:posts});
    } catch(error) {
        res.status(500).json({
            error: `Something went wrong during post retrieval`
        })
    }

})


// Get all posts for a specific book
app.get("/posts/:bookId", async (req:any, res:any) => {
    const bookId = req.params.bookId;
    try {
        const posts = await getBookPosts(bookId);
        res.status(200).json({posts:posts});
    } catch(error) {
        res.status(500).json({
            error: `Something went wrong during post retrieval`
        })
    }
})

//Get posts from books in all books in reading list
app.post("/users/:uid/readingListPosts", async (req:any, res:any) => {  
    const uid = req.params.uid;
    const bookList: string[]= req.body.bookList;
    try {
        const posts = await getUserReadingListPosts(uid, bookList);
        res.status(200).json({posts:posts});
    } catch(error) {
        res.status(500).json({
            error: `Something went wrong during post retrieval`
        })
    }
})

//return all books in user's reading list
app.put("/users/:uid/readingList", async (req:any, res:any) => {
    const bookIdList: book[] = req.body.books
    //No need for uid 
    const books = [] as book[];

    

    try{
        for (let bookId of bookIdList) {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=AIzaSyB9WLA7-drn_rM31AlbXGx6ddCc_1onjdo`)
            books.push(res.data)
        }

        res.status(200).json({books: books})
        
    } catch(error){
        res.status(500).json({
            error: `Something went wrong during book list retrieval`
        })
    }



})



app.listen(port, () => {
    console.log(`SERVER listening on port ${port}`);
  });

export default app;