import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateDoc,
  arrayUnion,
  doc,
  Timestamp,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { db, storage, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FollowUser } from "./../Functions/followUser";
import Avatar from "./common/Avatar";

function Sidebar() {
  const { user, setUser } = useContext(UserContext);
  const [postCaption, setPostCaption] = useState();
  const [progress, setProgress] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  let navigate = useNavigate();
  const handleChange = (e) => {
    if (e.target.files[0].size > 1024 * 1024) {
      alert("File size should be smaller than 1 MB");
      e.target.value = "";
    } else {
    }
    setProgress("");
  };

  const OnSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    const fileRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (error) => {
        setProgress(error.message);
      },
      () => {
        document.getElementById("post-form").reset();
        //upload picture to storage and get url
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const post = {
            image: downloadURL,
            caption: postCaption,
            uploadTime: Timestamp.now(),
            comments: [],
            likes: [],
            username: user.username,
            userAvatar: user.photo,
          };
          addDoc(collection(db, "posts"), post).then((postRef) => {
            const userRef = doc(db, "users", user.username);
            updateDoc(userRef, {
              posts: arrayUnion(postRef.id),
            }).catch((error) => {
              deleteObject(postRef)
                .then(() => {
                  // File deleted successfully
                  console.log("file deleted successfully");
                })
                .catch((error) => {
                  // Uh-oh, an error occurred!
                  console.log("error during file deletion");
                  setProgress("error lol");
                });
            });
          });
        });
      }
    );
  };
  const SignOut = () => {
    signOut(auth);
    setUser({});
    navigate("/login");
  };
  useEffect(() => {
    if (!user) {
      return;
    }
    const colRef = collection(db, "users");
    let q;
    if (!!user.following.length) {
      q = query(colRef, where("username", "not-in", user.following), limit(5));
    } else {
      q = query(colRef, limit(5));
    }
    getDocs(q).then((querySnapshot) => {
      let suggestions = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== user.username) {
          suggestions.push({ ...doc.data(), id: doc.id });
        }
      });
      console.log(user.username, suggestions);
      setSuggestedUsers(suggestions);
    });
  }, [user, user.following]);
  return (
    <div className="col-4">
      <div>
        <div>
          <h3>{user.username}</h3>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Create Post
        </button>
        <button className="btn btn-danger" onClick={SignOut}>
          Log Out
        </button>
      </div>
      <div className="suggestedUsers my-2">
        {suggestedUsers &&
          suggestedUsers.map((suggestedUser) => {
            return (
              <div id={`p-${suggestedUser.username}`} className="row">
                <div className="col-8 align-items-center pl-4 d-flex justify-content-start">
                  <Avatar photo={suggestedUser.photo} size={2} />
                  <h6 className="px-2">{suggestedUser.username}</h6>
                </div>
                <div className="col-4 ">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      const status = e.target.innerText.toLowerCase();
                      FollowUser(user, status, suggestedUser.username);
                      if (status === "follow") {
                        e.target.innerText = "Following";
                      } else {
                        e.target.innerText = "Follow";
                      }
                    }}
                    disabled={suggestedUser.username === user.username}
                  >
                    {suggestedUser.followers.includes(user.username)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Create Post
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form id="post-form" onSubmit={OnSubmit}>
                <input
                  name="picture"
                  type="file"
                  required
                  className="form-control form-control-sm"
                  placeholder="Picture"
                  id="picture"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="caption"
                  className="form-control"
                  placeholder="Enter Caption"
                  id="caption"
                  onChange={(e) => {
                    setPostCaption(e.target.value);
                  }}
                />
                <input
                  type="submit"
                  className="btn btn-lg btn-success"
                  value={"Upload"}
                />
              </form>
              <h6>Progress: {progress}</h6>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
