import {db} from "./firebase";
import { post } from "./types";



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
        console.log(posts);
        allPosts = [...allPosts, ...posts]
    }

    console.log(allPosts);

    //Sort all posts by their timeStamp
    allPosts.sort((a,b) => (a.timeStampNum > b.timeStampNum) ? -1 : ((b.timeStampNum > a.timeStampNum) ? 1 : 0));

    return allPosts;
}