import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Avatar from "../components/common/Avatar";
import Photo from "../assets/img/monke.jpg";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Profile() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  return (
    <>
      <Header />
      <div className="main-content border border-4">
        <div className="overview row m-4 ">
          <div className="col-4">
            <Avatar size={5} photo={user.photo} />
          </div>
          <div className="col-8 row">
            <div className="d-flex align-items-center">
              <h3 className=" pe-4">{user.username}</h3>
              <h5 className="">Edit Profile</h5>
            </div>
            <div className="user-stats d-flex ">
              <h6 className="pe-4">Posts: 10</h6>
              <h6 className="pe-4">Followers: 10</h6>
              <h6 className="pe-4">Following: 10</h6>
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
          <div className="col align-items-center ">
            <img src={Photo} alt="monke" className="img-fluid" />
          </div>
          <div className="col align-items-center ">
            <img src={Photo} alt="monke" className="img-fluid" />
          </div>
          <div className="col align-items-center ">
            <img src={Photo} alt="monke" className="img-fluid" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
