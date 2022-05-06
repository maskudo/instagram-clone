import Avatar from "./common/Avatar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
const fetchPosts = async () => {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("uploadTime", "desc"), limit(3));
  const querySnapshot = await getDocs(q);
  let posts = [];
  querySnapshot.forEach((doc) => {
    const post = { ...doc.data(), id: doc.id };
    posts.push(post);
  });
  console.log(posts);
  return posts;
};
function Timeline() {
  const { user } = useContext(UserContext);
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
          return (
            <div className="card my-4">
              <div className="card-header d-flex align-items-center">
                <Avatar photo={post.userAvatar} size={2.5} />
                <div className="mx-4">
                  <a href="/" className="nav-link">
                    {post.username}
                  </a>
                </div>
              </div>
              <div class="card-body p-0">
                <img
                  src={post.image}
                  alt="monke lol"
                  className="img-fluid p-0"
                />
              </div>
              <div className="text-start p-4">
                <div className="top-items row">
                  <ul className="navbar-nav col-9 d-flex flex-row p-2">
                    <li>
                      <a href="/" className="nav-link pe-2">
                        Like
                      </a>
                    </li>
                    <li>
                      <a href="/" className="nav-link pe-2">
                        Comment
                      </a>
                    </li>
                    <li>
                      <a href="/" className="nav-link pe-2">
                        Share
                      </a>
                    </li>
                  </ul>
                  <div className="col-3">
                    <a href="/" className="nav-link">
                      Copy Link
                    </a>
                  </div>
                </div>
                <div className="like-count m-0">
                  <p>2 likes</p>
                </div>
                <div className="caption">
                  <p>
                    <a href="/">{post.username}</a> {post.caption}
                  </p>
                </div>
                <div className="comment-box">
                  <div className="view-comment-menu">View All Comments</div>
                  <div className="comments">
                    <div className="comment">user.handle Cool pic sis</div>
                  </div>
                </div>
              </div>
              <div className="add-comment card-footer">
                <form className="row">
                  <div className="col-9 m-2">
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Add a comment..."
                    />
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-end">
                    <button
                      className="btn btn-outline-secondary "
                      type="submit"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Timeline;
