import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Avatar from "../components/common/Avatar";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { FollowUser , fetchFollows} from "../Functions/followFunctions.js";
import ProfileListItem from "../components/common/ProfileListItem";
import {fetchPostsByUsername} from "../Functions/fetchPostFunctions";

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
    fetchPostsByUsername(username).then((result) => {
      setPosts(result);
    });
    return () => {
      unsub();
    };
  }, [user, user.username, username]);

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
                        FollowUser(user, status, username);
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
                              <ProfileListItem
                                user={user}
                                profileListUser={follower}
                              />
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
                              <ProfileListItem
                                user={user}
                                profileListUser={following}
                              />
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
