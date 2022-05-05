import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

function Sidebar() {
  const { user } = useContext(UserContext);
  const [postCaption, setPostCaption] = useState();
  const handleChange = (e) => {
    if (e.target.files[0].size > 1024 * 1024) {
      alert("File size should be smaller than 1 MB");
      e.target.value = "";
    } else {
      const url = URL.createObjectURL(e.target.files[0]);
    }
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
              <form>
                <input
                  name="picture"
                  type="file"
                  className="form-control form-control-sm"
                  placeholder="Picture"
                  id="picture"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Caption"
                  id="caption"
                  onChange={(e) => {
                    setPostCaption(e.target.value);
                  }}
                />
              </form>
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
