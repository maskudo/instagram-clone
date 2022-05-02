import Photo from "../assets/img/monke.jpg";

let bgStylingObject = {
  backgroundImage: `url(${Photo})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "2.5rem",
  width: "2.5rem",
};
function Timeline() {
  return (
    <div className="col-8">
      <div class="card my-4">
        <div className="card-header d-flex align-items-center">
          <div style={bgStylingObject} className=" rounded-circle"></div>
          <div className="mx-4">
            <a href="/" className="nav-link">
              user.handle
            </a>
          </div>
        </div>
        <div class="card-body p-0">
          <img src={Photo} alt="monke lol" className="img-fluid p-0" />
        </div>
        <div className="card-footer text-start">
          <div className="top-items row">
            <ul className="navbar-nav col-9 d-flex flex-row">
              <li>
                <a href="/" className="nav-link p-2">
                  Like
                </a>
              </li>
              <li>
                <a href="/" className="nav-link p-2">
                  Comment
                </a>
              </li>
              <li>
                <a href="/" className="nav-link p-2">
                  Share
                </a>
              </li>
            </ul>
            <div className="col-3">
              <a href="/" className="nav-link">
                Copy Link
              </a>
            </div>
          </div>
          <div className="like-count m-0">
            <p>2 likes</p>
          </div>
          <div className="caption">
            <p>
              <a href="/">user.handle</a> Better to sink in the pee than to pee
              in the sink
            </p>
          </div>
          <div className="comment-box">
            <div className="view-comment-menu">View All Comments</div>
            <div className="comments">
              <div className="comment">user.handle Cool pic sis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
