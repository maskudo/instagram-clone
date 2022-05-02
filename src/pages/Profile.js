import Header from "../components/Header";
import Avatar from "../components/common/Avatar";
import Photo from "../assets/img/monke.jpg";
// let styleObject = {
//   backgroundImage: `url('${Photo}')`,
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "contain",
//   backgroundPosition: "center",
//   backgroundColor: "black",
//   height: "20%",
//   width: "20%",
// };

function Profile() {
  return (
    <>
      <Header />
      <div className="main-content border border-4">
        <div className="overview row m-4 ">
          <div className="col-4">
            <Avatar size={5} photo={Photo} />
          </div>
          <div className="col-8 row">
            <div className="d-flex align-items-center">
              <h3 className=" pe-4">user.handle</h3>
              <h5 className="">Edit Profile</h5>
            </div>
            <div className="user-stats d-flex ">
              <h6 className="pe-4">Posts: 10</h6>
              <h6 className="pe-4">Followers: 10</h6>
              <h6 className="pe-4">Following: 10</h6>
            </div>
          </div>
        </div>
        {/* <div className="my-4 px-4 pic-container row row-cols-sm-3 row-cols-1 g-2 g-lg-4 w-100">
          <div className="col-12" style={styleObject}></div>
        </div> */}
      </div>
    </>
  );
}

export default Profile;
