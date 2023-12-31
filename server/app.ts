import express, { Express } from "express";
import cors from "cors";

import { post, profile, book, reply} from './types';
import { signUp, updateUser, deleteUser, getUser} from "./people.controller";
import { createPost, getUserPosts, getBookPosts, getUserReadingListPosts, deleteUserPosts, getPost, updatePostLikes} from "./post.controller";
import { createReply, getReplies, updateReplyLikes, getUserReplies } from "./reply.controller";
import axios from 'axios';


const app: Express = express();
const port = 8080;



require('dotenv').config()
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


app.get("/users/:uid", async (req:any, res:any) => {
    const uid = req.params.uid;

    try {

        const user = await getUser(uid);
        res.status(200).json({userInfo: user});
        
    } catch (error) {
        res.status(500).json({
            error: `Something went wrong while retrieving the user`
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

app.get("/users/:uid/replies", async (req, res) => {
    const uid = req.params.uid
    console.log('here')
    try {
        const replies = await getUserReplies(uid);
        res.status(200).json({replies: replies})
    }catch(error){
        res.status(500).json({error: 'Something went wrong during reply retrieval'})
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
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.BOOKS_KEY}`)
            books.push(res.data)
        }

        res.status(200).json({books: books})
        
    } catch(error){
        res.status(500).json({
            error: `Something went wrong during book list retrieval`
        })
    }



})


app.get("/user-posts/:postId", async(req: any, res: any) => {
    const postId = req.params.postId

    try{
        const post = await getPost(postId)
        console.log(post)
        res.status(200).json({postInfo: post})



    }catch(error){
        res.status(500).json({error: 'Something went wrong while trying to retrieve this Post'})
    }

})

app.put('/posts/:postId/likes', async(req: any, res: any) => {
    const postId = req.params.postId
    const {like, dislike, userId} = req.body
    console.log({like, dislike, userId})

    try {
        await updatePostLikes(like, dislike, userId, postId)
        res.status(200).json({message: 'Successfully updated likes for this post'})

    }catch(error){
        res.status(500).json({error: 'Something went wrong while trying to like/dislike this post'})
    }


})

//Create a new reply
app.post('/replies', async(req: any, res: any) => {
    const reply: reply = req.body

    try{
        const rep =  await createReply(reply);
        res.status(200).json(rep)

    }catch(error){
        res.status(500).json({error: 'Something went wrong while trying to create a reply'})


    }


})


//Get the replies for a post
app.get('/posts/:postId/replies', async(req: any, res: any) => {

    const postId = req.params.postId
    try{
        const replies = await getReplies(postId);
        res.status(200).json({replies: replies})

    }catch(error){
        res.status(500).json({error: "Something went wrong while trying to retrieve replies for this post"})
    }


})

//update reply likes
app.put('/replies/:replyId/likes', async(req: any, res: any) => {
    const replyId = req.params.replyId
    const {like, dislike, userId} = req.body
    console.log({like, dislike, userId})

    try {
        await updateReplyLikes(like, dislike, userId, replyId)
        res.status(200).json({message: 'Successfully updated likes for this post'})

    }catch(error){
        res.status(500).json({error: 'Something went wrong while trying to like/dislike this post'})
    }


})



app.listen(port, () => {
    console.log(`SERVER listening on port ${port}`);
  });

export default app;