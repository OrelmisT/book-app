import {db} from "../firebase";
import { profile } from "../types";

const peopleCollectionRef = db.collection("people");



export const getUser = async (uid:string) => {
    const newDocRef = peopleCollectionRef.doc(uid);
    const document = await newDocRef.get();

    if(!document.exists){
        throw console.error("This user does not exist.");

    }

    return document.data();
}


//create a new user account
export const signUp = async (uid:string,person:profile) => {

    //First check if such an account exists
    const newDocRef = peopleCollectionRef.doc(uid);
    const document = await newDocRef.get();

    if(document.exists){
        return document.data();
    }
    
    await newDocRef.set(person);

    const document2 = await newDocRef.get();


    return document2.data();
}


//update a user account
export const updateUser = async (uid:string,person:profile) => {

    //First check if such an account exists
    const newDocRef = peopleCollectionRef.doc(uid);
    const document = await newDocRef.get();

    if(!document.exists){
        return null;
    }
    
    await newDocRef.update(person);

    const document2 = await newDocRef.get();
    return document2.data();
}

export const deleteUser = async (uid:string) => {
    
        //First check if such an account exists
        const newDocRef = peopleCollectionRef.doc(uid);
        const document = await newDocRef.get();
    
        if(!document.exists){
            return null;
        }
        
        await newDocRef.delete();
    
        return document.data();
}