import { doc,getDocs, updateDoc, arrayUnion, arrayRemove, collection, query, where } from "firebase/firestore";
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


export const fetchFollows = async (followsList) => {
  if (!followsList.length) {
    console.log("no followers lol");
    return [];
  }
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "in", followsList));
  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    const user = { ...doc.data(), id: doc.id };
    users.push(user);
  });
  return users;
};

