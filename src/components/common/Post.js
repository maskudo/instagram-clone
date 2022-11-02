import { db } from "../../firebase";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Avatar from "./Avatar";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

function Post({ post }) {
  const { user } = useContext(UserContext);
  const [uPost, setUPost] = useState(post);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState();

  const likePost = (e) => {
    const likeStatus = !liked;
    setLiked(likeStatus);
    const postRef = doc(db, "posts", post.id);
    if (likeStatus) {
      updateDoc(postRef, {
        likes: arrayUnion(user.username),
      });
    } else {
      updateDoc(postRef, {
        likes: arrayRemove(user.username),
      });
    }
  };
  const submitComment = (e) => {
    e.preventDefault();
    const comment = {
      text: commentText,
      username: user.username,
      createdAt: Timestamp.now(),
    };
    const postRef = doc(db, "posts", post.id);
    updateDoc(postRef, {
      comments: arrayUnion(comment),
    });
    const form = document.getElementById(`f-${uPost.id}`);
    form.reset();
    setCommentText("");
  };
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "posts", post.id), (doc) => {
      setUPost({ ...doc.data(), id: doc.id });
    });
    return () => {
      unsub();
    };
  }, [post.id]);
  useEffect(() => {
    setLiked(post.likes.includes(user.username));
  }, [user, post.likes]);
  return (
    <div className="card my-4">
      <div className="card-header d-flex align-items-center">
        <Avatar photo={uPost.userAvatar} size={2.5} />
        <div className="mx-4">
          <Link
            to={`/${uPost.username}`}
            className="fw-bold text-decoration-none text-reset"
          >
            {uPost.username}
          </Link>
        </div>
      </div>
      <div class="card-body p-0">
        <img src={uPost.image} alt={uPost.id} className="img-fluid w-100 p-0" />
      </div>
      <div className="text-start px-3 pt-2 pb-0 ">
        <div className="top-items row">
          <ul className="navbar-nav col-9 d-flex flex-row px-2 align-items-center">
            <li>
              <buttton
                onClick={likePost}
                className="btn btn-primary btn-sm pe-2"
              >
                Like{liked && "d"}
              </buttton>
            </li>
            <li>
              <Link to="/" className="nav-link pe-2">
                Comment
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-link pe-2">
                Share
              </Link>
            </li>
          </ul>
          <div className="col-3">
            <Link to="/" className="nav-link">
              Copy Link
            </Link>
          </div>
        </div>
        <div className="like-count m-0">
          <p className="text-muted my-0">
            {(uPost.likes.length && uPost.likes.length + " Likes") ||
              (!uPost.likes.length && "Be the first one to like!")}
          </p>
        </div>
        <div className="caption">
          <p className="my-0">
            <Link
              to={`/${uPost.username}`}
              className="fw-bold text-decoration-none text-reset"
            >
              {uPost.username}
            </Link>{" "}
            {uPost.caption}
          </p>
        </div>
        <div className="comment-box">
          {!!uPost.comments.length ? (
            <p className="link-secondary">
              View all {uPost.comments.length} comments
            </p>
          ) : (
            <p className="text-muted">
              No comments yet. Be the first to comment.
            </p>
          )}
        </div>
      </div>
      <div className="add-comment border-top">
        <form className="row" onSubmit={submitComment} id={`f-${uPost.id}`}>
          <div className="col-9 m-2">
            <input
              name="comment"
              required
              minLength={0}
              maxLength={150}
              onChange={(e) => {
                setCommentText(e.target.value);
              }}
              type="text"
              className="form-control border-0"
              placeholder="Add a comment..."
            />
          </div>
          <div className="col-2 d-flex align-items-center justify-content-end">
            <button className="btn btn-outline-secondary" type="submit">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Post;
