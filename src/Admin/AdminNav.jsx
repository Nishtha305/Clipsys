import React from "react";
import * as FcIcons from "react-icons/fc";
// import { ProgressBar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

function AdminNavbar({ setLoginUser }) {
  const history = useNavigate();
  // const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  // const [u, setu] = useState({ ...userDetail });
  const logout = async () => {
    setLoginUser();
    localStorage.removeItem("userDetail");
    history("/");
  };

  return (
    <>
      <nav
        style={{
          width: "100vw",
          height: "10vh",
          zIndex: 1,
          position: "fixed",
          top: 0,
        }}
        className="navbar bg-dark navbar-expand-lg navbar-dark"
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand" to={"/Dashboard"}>
            <FcIcons.FcVideoCall className="m-1" size={40} />
            ClipSys
          </NavLink>

          <button
            className="navbar-toggler me-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse bg-dark"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto pb-1 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link active"
                  style={{ fontSize: "1rem", textAlign: "center" }}
                  aria-current="page"
                  to="/Dashboard"
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link active"
                  style={{ fontSize: "1rem", textAlign: "center" }}
                  aria-current="page"
                  to="/UploadMovies"
                >
                  Movies
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link active"
                  style={{ fontSize: "1rem", textAlign: "center" }}
                  aria-current="page"
                  to="/UpdateRates"
                >
                  Rates
                </NavLink>
              </li>
            </ul>
            <div className="d-flex justify-content-center">
              <button
                className="d-flex justify-content-center btn btn-light me-3"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
export default AdminNavbar;
