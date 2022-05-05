import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useState } from "react";
import { updateDoc, arrayUnion, doc, Timestamp } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import { db, storage } from "../firebase";

const updateUserPosts = async (username, post) => {
  const userRef = doc(db, "users", username);

  // Atomically add a new region to the "regions" array field.
  await updateDoc(userRef, {
    posts: arrayUnion(post),
  });
};

function Sidebar() {
  const { user } = useContext(UserContext);
  const [postCaption, setPostCaption] = useState();
  const [progress, setProgress] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0].size > 1024 * 1024 * 2) {
      alert("File size should be smaller than 2 MB");
      e.target.value = "";
    } else {
      console.log(e.target.files[0]);
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
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const post = {
            image: downloadURL,
            caption: postCaption,
            uploadTime: Timestamp.now(),
          };
          updateUserPosts(user.username, post);
        });
      }
    );
  };
  return (
    <div className="col-4">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Create Post
      </button>

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
              <button type="button" class="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
