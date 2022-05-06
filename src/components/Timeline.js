import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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
