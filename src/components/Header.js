import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function Header() {
  const { user } = useContext(UserContext);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid row header-margin text-start">
          <Link to="/" className="navbar-brand col-4 fs-2">
            Instagram
          </Link>
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
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="message">
                  Message
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/${user.username}`}>
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
