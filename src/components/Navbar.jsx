import { React, useState } from "react";
import * as RiIcons from "react-icons/ri";
import * as BsIcons from "react-icons/bs";
import * as FcIcons from "react-icons/fc";
import { Modal, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import '../css/search.css'

const Navbar = ({ setLoginUser, channel, setChannel }) => {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [channelName, setChannelName] = useState({ channelName: "" });
  const [description, setChannelDescription] = useState({ description: "" });
  const history = useNavigate();
  const [showModal, setShow] = useState(false);
  const [showModal1, setShow1] = useState(false);
  const [video, setVideo] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
  });
  const handleClose = () => setShow(false);
  const handleClose1 = () => setShow1(false);
  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);
  const logout = async () => {
    localStorage.removeItem("userDetail");
    setLoginUser();
    history("/");
  };
  const funcChannelName = (e) => {
    const { name, value } = e.target;
    setChannelName({ ...channelName, [name]: value });
  };
  const funcChannelDescription = (e) => {
    const { name, value } = e.target;
    setChannelDescription({ ...description, [name]: value });
  };

  const onCreate = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/channel/createChannel", {
        channelName: channelName.channelName,
        description: description.description,
        userType: userDetail.userType,
        _id: userDetail._id,
      })
      .then((res) => {
        console.log("navbar:->", res.data);
        setChannel(true);
      });
  };

  const [search, setSearch] = useState({});
  const onSearchHandle = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };
  const onSearchVideo = (e) => {
    e.preventDefault();
    history(`/search/${search.title}`);
  };

  // const uploadVideo = async (files) => {
  //   const config = {
  //     header: {
  //       "content-type": "multipart/form-data",
  //       "x-auth-token": `${userDetail.token}`,
  //     },
  //   };
  //   const formData = new FormData();
  //   formData.append("video", video);
  //   formData.append("title", data.title);
  //   formData.append("description", data.description);
  //   formData.append("category", data.category);
  //   formData.append("email", userDetail.email);
  //   for (var pair of formData.entries()) {
  //     console.log(pair[0] + ", " + pair[1]);
  //   }

  //   await axios
  //     .post("http://localhost:5000/videos/upload", formData, options, config)
  //     .then((res) => {
  //       alert(res.data.msg);

  //       history("/");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  return (
    <>
      <nav
        style={{
          width: "97vw",
          height: "10vh",
          zIndex: 1,
          position: "fixed",
          top: 0,
        }}
        className="navbar bg-dark navbar-expand-lg navbar-dark"
      >
        <div className="container-fluid">
          <p className="navbar-brand">
            <FcIcons.FcVideoCall className="m-1" size={40} />
            ClipSys
          </p>
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
            className="w-auto collapse navbar-collapse bg-dark"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav w-auto me-auto pb-2 mb-lg-0">
              <li className="nav-item">
                {userDetail.userType !== "premiumUser" &&
                userDetail.userType !== "admin" ? (
                  <NavLink
                    className="nav-link active"
                    style={{ fontSize: "1rem", textAlign: "center" }}
                    aria-current="page"
                    to="/premium"
                  >
                    Premium
                  </NavLink>
                ) : (
                  <>
                    {userDetail.userType === "admin" ? (
                      <NavLink
                        className="nav-link active"
                        style={{ fontSize: "1rem", textAlign: "center" }}
                        aria-current="page"
                        to="/Dashboard"
                      >
                        Dashboard
                      </NavLink>
                    ) : (
                      <p className="m-1"></p>
                    )}
                  </>
                )}
              </li>
            </ul>
            {/*  */}
            <form className="d-flex" onSubmit={onSearchVideo}>
              <input
                className="form-control me-1 p-1 search-click"
                // style={{ border: '1px solid'        
                // ,outline: 'none', background: 'transparent', 
                // color: 'white'}}
                
                type="search"
                placeholder="Search"
                aria-label="Search"
                name="title"
                onChange={onSearchHandle}
                required
              />
              <button className="btn btn1 btn-dark text-light" type="submit">
                <BsIcons.BsSearch size={18}/>
              </button>
            </form>
            <div>
              {JSON.parse(localStorage.getItem('userDetail')).userType === "premiumUser" ? (
                <>
                  {JSON.parse(localStorage.getItem("userDetail"))
                    .channelName ? (
                    <Tippy arrow={false} content="Create Channel">
                      <Button
                        className="btn btn-dark m-0 p-0 btn1"
                        onClick={handleShow}
                        style={{ outline: "none" }}
                      >
                        <RiIcons.RiVideoUploadLine
                          className="text-white m-3"
                          size={25}
                        />
                      </Button>
                    </Tippy>
                  ) :"" 
                    
                  }
                  <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Your channel</Modal.Title>
                    </Modal.Header>
                    <form
                      method="post"
                      onSubmit={(e) => {
                        onCreate(e);
                        alert(
                          "Channel Created Successfully! You can upload video from Your channel"
                        );
                        history("/");
                        handleClose();
                      }}
                    >
                      <Modal.Body>
                        <div>
                          <input
                            type="text"
                            name="channelName"
                            placeholder="Channel Name"
                            required
                            onChange={funcChannelName}
                            value={channelName.channelName}
                          />
                          <br />
                          <br />
                          <textarea
                            type="text"
                            rows="7"
                            cols="50"
                            name="description"
                            onChange={funcChannelDescription}
                            value={description.description}
                            placeholder="Write Something about your channel"
                            required
                          />
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          variant="dark"
                          type="submit"
                          // onClick={}
                        >
                          Create Channel
                        </Button>
                      </Modal.Footer>
                    </form>
                  </Modal>
                </>
              ) : (
                ""
              )}
            </div>
            <div>
              <button className="d-flex btn btn-light" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
