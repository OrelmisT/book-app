import { FieldValue } from "firebase-admin/firestore";
import {db} from "../firebase";
import { post } from "../types";



export const createPost = async (uid:string, post:post) => {
    const userDocRef = db.collection("people").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return null;
    }
    const newDocRef = db.collection("posts").doc(post.postId);
    await newDocRef.set(post);
    const document = await newDocRef.get();
    return document.data();
}


export const getUserPosts = async (uid:string) => {
    const userDocRef = db.collection("people").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return null;
    }

    const postsRef = db.collection("posts");
    const snapshot = await postsRef.where("userId", "==", uid).get();
    const posts = snapshot.docs.map(doc => doc.data()).sort((a,b) => (a.timeStampNum > b.timeStampNum) ? -1 : ((b.timeStampNum > a.timeStampNum) ? 1 : 0));
    return posts;
}

export const getBookPosts = async (bookId:string) => {
    const postsRef = db.collection("posts");
    const snapshot = await postsRef.where("bookId", "==", bookId).get();
    const posts = snapshot.docs.map(doc => doc.data()).sort((a,b) => (a.timeStampNum > b.timeStampNum) ? -1 : ((b.timeStampNum > a.timeStampNum) ? 1 : 0));
    return posts;
}


export const getUserReadingListPosts = async (uid:string, bookList: string[]) => {
    const userDocRef = db.collection("people").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return null;
    }

    let allPosts = [] as FirebaseFirestore.DocumentData[];

    for(let i = 0; i < bookList.length; i++){
        const posts = await getBookPosts(bookList[i]);
        allPosts = [...allPosts, ...posts]
    }

    //Sort all posts by their timeStamp
    allPosts.sort((a,b) => (a.timeStampNum > b.timeStampNum) ? -1 : ((b.timeStampNum > a.timeStampNum) ? 1 : 0));

    return allPosts;
}



export const deleteUserPosts = async (uid:string) => {
   
    const postsRef = db.collection("posts");
   
    const snapshot = await postsRef.where("userId", "==", uid).get();
    
    const batch = db.batch()
    snapshot.docs.map((userComment) => {batch.delete(userComment.ref)})
    await batch.commit();

    
}


export const getPost = async (postId:string) => {
    const postRef =  db.collection("posts").doc(postId)
    const postInfo = await postRef.get()


    if (!postInfo.exists){
        throw console.error("This post does not exist");
    }

    return  postInfo.data()
}


export const updatePostLikes = async (like:boolean, dislike:boolean, userId: string, postId: string) => {
    const postRef =  db.collection("posts").doc(postId)
    if(like){
       await postRef.update('likers', FieldValue.arrayUnion(userId))

    }else{
        await postRef.update('likers', FieldValue.arrayRemove(userId))

    }

    if(dislike){
        await postRef.update('dislikers', FieldValue.arrayUnion(userId))

    }else{
        await postRef.update('dislikers', FieldValue.arrayRemove(userId))

    }

}


export const updatePost = async (postId: string, post:post) =>{
    const postRef =  db.collection("posts").doc(postId)
    const postDoc = await postRef.get()

    if (!postDoc.exists){
        return null
    }

    postRef.update(post)

    return (await postRef.get()).data()


}

export const deletePost = async(postId: string) => {
    const postRef = db.collection("posts").doc(postId)
    const postDoc = await postRef.get()

    if (!postDoc.exists){
        return null
    }

    postRef.delete()

    return postDoc.data()
}