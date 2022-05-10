import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Avatar from "../components/common/Avatar";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const fetchPosts = async (username) => {
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

function Profile() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [isLoggedUser, setIsLoggedUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState("");
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setIsLoggedUser(user.username === username);
    const unsub = onSnapshot(doc(db, "users", username), (doc) => {
      if (doc.exists()) {
        setUserData({ ...doc.data(), username: username });
      } else {
        // doc.data() will be undefined in this case
        setUserData(false);
      }
      setIsLoading(false);
    });
    fetchPosts(username).then((result) => {
      setPosts(result);
    });
    return () => {
      unsub();
    };
  }, [user, user.username, username]);
  const FollowUser = (e) => {
    const status = e.target.innerText.toLowerCase();
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
  return (
    <>
      <Header />
      <div className="main-content border border-4">
        {!userData && !isLoading && <h1>User {username} not found </h1>}
        {!!userData && (
          <>
            <div className="overview row m-4 ">
              <div className="col-4">
                <Avatar size={5} photo={userData.photo} />
              </div>
              <div className="col-8 row">
                <div className="d-flex align-items-center">
                  <h3 className=" pe-4">{userData.username}</h3>
                  {isLoggedUser ? (
                    <h5 className="">Edit Profile</h5>
                  ) : (
                    <button className="btn btn-primary" onClick={FollowUser}>
                      Follow
                      {Object.keys(userData).includes("followers") &&
                        userData.followers.includes(user.username) &&
                        "ing"}
                    </button>
                  )}
                </div>
                <div className="user-stats d-flex ">
                  <h6 className="pe-4">
                    Posts:{" "}
                    {("posts" in userData && userData.posts.length) || "0"}
                  </h6>
                  <h6 className="pe-4">
                    Followers:{" "}
                    {("followers" in userData && userData.followers.length) ||
                      "0"}
                  </h6>
                  <h6 className="pe-4">
                    Following:{" "}
                    {("following" in userData && userData.following.length) ||
                      "0"}
                  </h6>
                </div>
              </div>
            </div>
            <div className="m-4 pic-container row row-cols-sm-3 row-cols-1 g-2 g-lg-4">
              {/* <div className="col-12" style={styleObject}></div> */}
              {!!posts.length ? (
                posts.map((post) => {
                  return (
                    <div className="col align-items-center" id={post.id}>
                      <img src={post.image} alt="" className="img-fluid" />
                    </div>
                  );
                })
              ) : (
                <h1>No Posts found</h1>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
