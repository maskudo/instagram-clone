import { db } from "../../firebase";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Avatar from "./Avatar";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";

function Post({ post }) {
  const [uPost, setUPost] = useState(post);
  const [commentText, setCommentText] = useState("");
  const { user } = useContext(UserContext);
  const submitComment = (e) => {
    e.preventDefault();
    const comment = {
      text: commentText,
      username: user.username,
      createdAt: Timestamp.now(),
    };
    const postRef = doc(db, "posts", post.id);
    console.log("here lol");
    updateDoc(postRef, {
      comments: arrayUnion(comment),
    })
      .then(() => {
        post.comments.push(comment);
        setUPost(post);
      })
      .catch((error) => {
        console.log(error.message);
      });

    const form = document.getElementById(`f-${uPost.id}`);
    form.reset();
    setCommentText("");
  };
  return (
    <div className="card my-4">
      <div className="card-header d-flex align-items-center">
        <Avatar photo={uPost.userAvatar} size={2.5} />
        <div className="mx-4">
          <a href="/" className="nav-link">
            {uPost.username}
          </a>
        </div>
      </div>
      <div class="card-body p-0">
        <img src={uPost.image} alt="monke lol" className="img-fluid p-0" />
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
            <a href="/">{uPost.username}</a> {uPost.caption}
          </p>
        </div>
        <div className="comment-box">
          <div className="view-comment-menu">View All Comments</div>
          <div className="comments">
            {uPost.comments.length ? (
              uPost.comments.map((comment) => {
                return (
                  <div className="comment">
                    <p>
                      <span className="bold">{comment.username}</span>{" "}
                      {comment.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="bg-light">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="add-comment card-footer">
        <form className="row" onSubmit={submitComment} id={`f-${uPost.id}`}>
          <div className="col-9 m-2">
            <input
              name="comment"
              required
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
