function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid row header-margin">
          <a href="/" className="navbar-brand col-4">
            Instagram
          </a>
          <div
            className="collapse navbar-collapse col-8 row"
            id="navbarSupportedContent"
          >
            <form className="d-flex col-6">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </form>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-evenly col-6">
              <li className="nav-item">
                <a className="nav-link" href="home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="noti">
                  Post
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="profile">
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
