import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Avatar from "../components/common/Avatar";
import Photo from "../assets/img/monke.jpg";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const getUserData = async (username) => {
  console.log("data ol");
  const userRef = doc(db, "users", username);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return { ...docSnap.data(), username: username };
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return 0;
  }
};

function Profile() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [isLoggedUser, setIsLoggedUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState("");
  useEffect(() => {
    if (user.username !== username) {
      setIsLoggedUser(false);
      getUserData(username).then((result) => {
        setUserData(result);
        setIsLoading(false);
      });
    } else {
      setUserData(user);
    }
  }, [user, user.username, username]);
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
                    <button className="btn btn-primary">Follow</button>
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
              <div className="col align-items-center ">
                <img src={Photo} alt="monke" className="img-fluid" />
              </div>
              <div className="col align-items-center ">
                <img src={Photo} alt="monke" className="img-fluid" />
              </div>
              {"posts" in userData &&
                userData.posts.length &&
                userData.posts.map((post) => {
                  //fetch posts first lol
                  return (
                    <>
                      <div className="col align-items-center ">
                        <img src={Photo} alt="monke" className="img-fluid" />
                      </div>
                    </>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
