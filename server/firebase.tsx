// @ts-nocheck
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore} from "firebase-admin/firestore";
import service_account from "./service_account.json";
 
const app = initializeApp({
  credential: cert(service_account),
});

const db = getFirestore();

export { db };