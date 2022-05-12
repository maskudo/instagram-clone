import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import Post from "./common/Post";
const fetchPosts = async () => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("uploadTime", "desc"), limit(3));
  const querySnapshot = await getDocs(q);
  let posts = [];
  querySnapshot.forEach((doc) => {
    const post = { ...doc.data(), id: doc.id };
    posts.push(post);
  });
  return posts;
};
function Timeline() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };
    getPosts();
  }, []);
  useEffect(() => {
    const handleScroll = async () => {
      const windowHeight =
        "innerHeight" in window
          ? window.innerHeight
          : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowBottom = windowHeight + window.pageYOffset;
      if (Math.ceil(windowBottom) >= docHeight - 1) {
        if (posts.length) {
          const lastPost = posts[posts.length - 1];
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
          setPosts([...posts, ...nextPosts]);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <div className="col-8">
      {!!posts.length &&
        posts.map((post) => {
          return <Post post={post} />;
        })}
    </div>
  );
}

export default Timeline;
