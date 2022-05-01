import Photo from "../assets/img/monke.jpg";
function Timeline() {
  return (
    <div className="col-8">
      <div class="card my-4">
        <div className="card-header d-flex align-items-center">
          <div className="avatar rounded-circle"></div>
          <div className="mx-4">
            <a href="/" className="nav-link">
              user.handle
            </a>
          </div>
        </div>
        <div class="card-body">
          <img src={Photo} alt="monke lol" className="img-fluid p-0" />
        </div>
        <div className="card-footer">
          <h2>Lol</h2>
        </div>
      </div>
      <div class="card my-4">
        <h5 class="card-header">Featured</h5>
        <div class="card-body">
          <img src={Photo} alt="monke lol" className="img-fluid p-0" />
        </div>
        <div className="card-footer">
          <h2>Lol</h2>
        </div>
      </div>
    </div>
  );
}

export default Timeline;
