import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Header() {
  const { user } = useContext(UserContext);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid row header-margin text-start">
          <a href="/" className="navbar-brand col-4 fs-2">
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-between col-6">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="message">
                  Message
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/${user.username}`}>
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
