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
import { FollowUser, fetchFollows } from "../Functions/followFunctions.js";
import FollowModal from "../components/Profile/FollowModal";
import { fetchPostsByUsername } from "../Functions/fetchPostFunctions";
import UserPosts from "../components/Profile/UserPosts";

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
                  <>
                    <h6 className="pe-4">
                      {("posts" in userData && userData.posts.length) || "0"}{" "}
                      Posts
                    </h6>
                  </>

                  <>
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
                      <FollowModal title="Followers" user={user} follows={followers} />
                    </div>
                  </>

                  <>
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
                      <FollowModal title="Following" user={user} follows={followings} />
                    </div>
                  </>

                </div>
              </div>
            </div>

            <UserPosts posts={posts} />
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
