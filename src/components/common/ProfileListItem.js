import { FollowUser } from "../../Functions/followUser";
import Avatar from "./Avatar";
function ProfileListItem({ user, profileListUser }) {
  return (
    <div
      id={`p-${profileListUser.username}`}
      className="row pb-3 d-flex align-items-center"
    >
      <div className="col-8 align-items-center d-flex justify-content-start">
        <Avatar photo={profileListUser.photo} size={3} />
        <h6 className="px-2">{profileListUser.username}</h6>
      </div>
      <div className="col-4 ">
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const status = e.target.innerText.toLowerCase();
            FollowUser(user, status, profileListUser.username);
            if (status === "follow") {
              e.target.innerText = "Following";
            } else {
              e.target.innerText = "Follow";
            }
          }}
          disabled={profileListUser.username === user.username}
        >
          {profileListUser.followers.includes(user.username)
            ? "Unfollow"
            : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default ProfileListItem;
