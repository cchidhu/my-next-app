import { addDoc, collection } from "firebase/firestore"
import { db } from "./firebase"


const usersRef = collection(db, "users")

export function updateUser(uid, data) {
  return usersRef.doc(uid).update(data)
}

export function createUser(uid, data) {
  return addDoc(usersRef,{
    uid,
    ...data
  })
}