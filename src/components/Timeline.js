import { useEffect, useState } from "react";
import Post from "./common/Post";
import {fetchPostsByCount, fetchPostsAfter} from "../Functions/fetchPostFunctions";

function Timeline() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const fetchedPosts = await fetchPostsByCount(3);
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
          const nextPosts = await fetchPostsAfter(lastPost);
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
