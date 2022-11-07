import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  startAfter,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const fetchPostsByUsername = async (username) => {
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    where("username", "==", username),
    orderBy("uploadTime", "desc")
  );
  const querySnapshot = await getDocs(q);
  let posts = [];
  querySnapshot.forEach((doc) => {
    const post = { ...doc.data(), id: doc.id };
    posts.push(post);
  });
  return posts;
};

export const fetchPostsByCount = async (count) => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("uploadTime", "desc"), limit(count));
  const querySnapshot = await getDocs(q);
  let posts = [];
  querySnapshot.forEach((doc) => {
    const post = { ...doc.data(), id: doc.id };
    posts.push(post);
  });
  return posts;
};

export const fetchPostsAfter = async (lastPost) => {
    const docSnap = await getDoc(
      doc(collection(db, "posts"), lastPost.id)
    );
    const nextDocsQuery = query(
      collection(db, "posts"),
      orderBy("uploadTime", "desc"),
      limit(3),
      startAfter(docSnap)
    );
    const querySnapshot = await getDocs(nextDocsQuery);
    let nextPosts = [];
    querySnapshot.forEach((doc) => {
      const newPost = { ...doc.data(), id: doc.id };
      nextPosts.push(newPost);
    });
    return nextPosts;
};

