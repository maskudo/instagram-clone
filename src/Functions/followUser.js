import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

export const FollowUser = (user, status, username) => {
  //update user.username's following list
  const followingRef = doc(db, "users", user.username);
  updateDoc(followingRef, {
    following:
      status === "follow" ? arrayUnion(username) : arrayRemove(username),
  }).catch((error) => {
    console.log(error.message);
  });
  //update username's followers list
  const followersRef = doc(db, "users", username);
  updateDoc(followersRef, {
    followers:
      status === "follow"
        ? arrayUnion(user.username)
        : arrayRemove(user.username),
  }).catch((error) => {
    console.log(error.message);
  });
};
