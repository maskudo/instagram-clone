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
const fetchFollows = async (followsList) => {
  if (!followsList.length) {
    console.log("no followers lol");
    return [];
  }
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "in", followsList));
  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    const user = { ...doc.data(), id: doc.id };
    users.push(user);
  });
  return users;
};

function Profile() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [isLoggedUser, setIsLoggedUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState("");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
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
  const FollowUser = (status, username) => {
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
      <div className="main-content">
        {!userData && !isLoading && <h1>User {username} not found </h1>}
        {!!userData && (
          <>
            <div className=" overview row ">
              <div className="col-sm-4 col-12">
                <Avatar size={9} photo={userData.photo} />
              </div>

              <div className="col-sm-8 col-12 row">
                <div className="d-flex align-items-center">
                  <h3 className=" pe-4">{userData.username}</h3>
                  {isLoggedUser ? (
                    <h5 className="">Edit Profile</h5>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={(e) => {
                        const status = e.target.innerText.toLowerCase();
                        FollowUser(status, username);
                      }}
                    >
                      {userData.followers.includes(user.username)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  )}
                </div>

                <div className="user-stats d-flex ">
                  <h6 className="pe-4">
                    {("posts" in userData && userData.posts.length) || "0"}{" "}
                    Posts
                  </h6>

                  <h6
                    className="pe-4 "
                    role={"button"}
                    data-bs-toggle="modal"
                    data-bs-target="#followersModal"
                    onClick={async () => {
                      const followersList = await fetchFollows(
                        userData.followers
                      );
                      setFollowers(followersList);
                    }}
                  >
                    {("followers" in userData && userData.followers.length) ||
                      "0"}{" "}
                    Followers
                  </h6>

                  <div
                    className="modal fade"
                    id="followersModal"
                    tabIndex="-1"
                    aria-labelledby="followersModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Followers
                          </h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          {followers.map((follower) => {
                            return (
                              <div
                                id={`p-${follower.username}`}
                                className="row"
                              >
                                <div className="col-8 align-items-center pl-4 d-flex justify-content-start">
                                  <Avatar photo={follower.photo} size={2} />
                                  <h6 className="px-2">{follower.username}</h6>
                                </div>
                                <div className="col-4 ">
                                  <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                      const status =
                                        e.target.innerText.toLowerCase();
                                      FollowUser(status, follower.username);
                                      if (status === "follow") {
                                        e.target.innerText = "Following";
                                      } else {
                                        e.target.innerText = "Follow";
                                      }
                                    }}
                                    disabled={
                                      follower.username === user.username
                                    }
                                  >
                                    {follower.followers.includes(user.username)
                                      ? "Unfollow"
                                      : "Follow"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6
                    className="pe-4 "
                    role={"button"}
                    data-bs-toggle="modal"
                    data-bs-target="#followingModal"
                    onClick={async () => {
                      const followingList = await fetchFollows(
                        userData.following
                      );
                      setFollowings(followingList);
                    }}
                  >
                    {("following" in userData && userData.following.length) ||
                      "0"}{" "}
                    Following
                  </h6>

                  <div
                    className="modal fade"
                    id="followingModal"
                    tabIndex="-1"
                    aria-labelledby="followingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Following
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          {followings.map((following) => {
                            return (
                              <div
                                id={`p-${following.username}`}
                                className="row"
                              >
                                <div className="col-8 align-items-center pl-4 d-flex justify-content-start">
                                  <Avatar photo={following.photo} size={2} />
                                  <h6 className="px-2">{following.username}</h6>
                                </div>
                                <div className="col-4 ">
                                  <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                      const status =
                                        e.target.innerText.toLowerCase();
                                      FollowUser(status, following.username);
                                      if (status === "follow") {
                                        e.target.innerText = "Unfollow";
                                      } else {
                                        e.target.innerText = "Follow";
                                      }
                                    }}
                                    disabled={
                                      following.username === user.username
                                    }
                                  >
                                    {following.followers.includes(user.username)
                                      ? "Unfollow"
                                      : "Follow"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row row-cols-md-3 row-cols-1 border-top">
              {!!posts.length ? (
                posts.map((post) => {
                  return (
                    <>
                      <div className="col align-items-center pt-4 pb-0">
                        <img
                          src={post.image}
                          alt=""
                          className="profile-post img-fluid w-100"
                          id={post.id}
                        />
                      </div>
                      <div className="col align-items-center pt-4 pb-0 ">
                        <img
                          src={post.image}
                          alt=""
                          className="profile-post img-fluid w-100"
                          id={post.id}
                        />
                      </div>
                    </>
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
