import express, { Express } from "express";
import cors from "cors";

import { post, profile } from './types';
import { signUp, updateUser, deleteUser} from "./people.controller";
import { createPost, getUserPosts, getBookPosts, getUserReadingListPosts } from "./post.controller";

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
app.post("/api/users/:uid", async (req:any, res:any) => {

    
    // console.log(envVars);

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


app.put("/api/users/:uid", async (req:any, res:any) => {
    
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
app.delete("/api/users/:uid", async (req:any, res:any) => {
    const uid = req.params.uid;
    try {
        const deletedProfile = await deleteUser(uid);
        res.status(200).json(deletedProfile);
    } catch(error) {
        res.status(500).json({
            error: `Something went wrong during user deletion`
        })
    }
});


//Create a post
app.post("/api/users/:uid/posts", async (req:any, res:any) => {
    const post: post = req.body.post;
    console.log('here');
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
app.get("/api/users/:uid/posts", async (req:any, res:any) => {
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

app.get("/api/posts/:bookId", async (req:any, res:any) => {
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

app.post("/api/users/:uid/readingListPosts", async (req:any, res:any) => {  
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



app.listen(port, () => {
    console.log(`SERVER listening on port ${port}`);
  });

