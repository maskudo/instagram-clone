import ProfileListItem from "../common/ProfileListItem";

export default function FollowModal({ title, follows, user }) {
  return (
    <>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {title}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {follows.map((follow) => {
              return (
                <ProfileListItem
                  user={user}
                  profileListUser={follow}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  )
}
