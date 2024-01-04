import { FieldValue } from "firebase-admin/firestore";
import {db} from "../firebase";
import { reply } from "../types";

const replyCollectionRef = db.collection("replies");


export const createReply = async (reply:reply) => {

    //First check if the person attempting the post exists
    const userDocRef = db.collection("people").doc(reply.posterId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return null;
    }


    const newReplyRef =  replyCollectionRef.doc(reply.replyId)
    await newReplyRef.set(reply)
    const newReplyDoc = await newReplyRef.get()
    return newReplyDoc
}

export const getReplies = async (postId: string) => {
    const snapshot = await replyCollectionRef.where("postId", "==", postId).get()
    const replies = snapshot.docs.map(doc => doc.data())
    return replies;
}

export const updateReplyLikes = async (like:boolean, dislike:boolean, userId: string, replyId: string) => {
    const postRef =  db.collection("replies").doc(replyId)
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

export const getUserReplies = async (uid: string) => {
    const userDocRef = db.collection("people").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return null;
    }

    const repliesRef = db.collection("replies");
    const snapshot = await repliesRef.where("posterId", "==", uid).get();
    const replies = snapshot.docs.map(doc => doc.data()).sort((a,b) => (a.timeStampNum > b.timeStampNum) ? -1 : ((b.timeStampNum > a.timeStampNum) ? 1 : 0));
    return replies;
}



// export const getUserPosts = async (uid:string) => {
//     const userDocRef = db.collection("people").doc(uid);
//     const userDoc = await userDocRef.get();

//     if (!userDoc.exists) {
//         return null;
//     }

//     const postsRef = db.collection("posts");
//     const snapshot = await postsRef.where("userId", "==", uid).get();
//     const posts = snapshot.docs.map(doc => doc.data()).sort((a,b) => (a.timeStampNum > b.timeStampNum) ? -1 : ((b.timeStampNum > a.timeStampNum) ? 1 : 0));
//     return posts;
// }