import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { Modal, Button, ProgressBar } from "react-bootstrap";
import Avatar from "react-avatar";
// import "bootstrap/dist/css/bootstrap.min.css";

const ShowChannel = ({ setLoginUser, setChannel, channel }) => {
  // const user = JSON.parse(localStorage.getItem("userDetail"));
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [buttonText, setButtonText] = useState(false);
  const [showModal1, setShow1] = useState(false);
  const [showModal2, setShow2] = useState(false);
  const [showModalDelete, setShowDelete] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleClose2 = () => setShow2(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShow1 = () => setShow1(true);
  const handleShow2 = () => setShow2(true);
  const handleShowDelete = () => setShowDelete(true);
  const style = {
    margin: "5px 3px",
    padding: "3px",
  };

  // const [channel, setChannel] = useState(false);
  // const onSubscribe = () => {
  //   axios.patch(`http://localhost:5000/channel/`);
  // };
  // const onUnSubscribe = () => {};
  const videoHandle = (e) => {
    if (e.target.files[0].size > 1024 * 1024 * 1024 * 2) {
      alert("File Size is to Big it must be less than 2gb");
      setVideo(false);
    } else {
      console.log(e.target.files[0]);
      setVideo(e.target.files[0]);
      setData({ ...data, url: `videos/${e.target.files[0].name}` });
    }
  };
  const dataHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const [video, setVideo] = useState(null);
  const [videoUploadPercentage, setVideoUploadPercentage] = useState(0);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
  });
  const uploadVideo = async (e) => {
    e.preventDefault();
    const options = {
      onUploadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded / 1024}kb of ${total / 1024}kb | ${percent}`);
        if (percent < 100) {
          setVideoUploadPercentage(percent);
        }
      },
    };
    const config = {
      header: {
        "content-type": "multipart/form-data",
        "x-auth-token": `${userDetail.token}`,
      },
    };
    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("email", userDetail.email);
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    await axios
      .post("http://localhost:5000/videos/upload", formData, options, config)
      .then((res) => {
        if (res) {
          // console.log(res);
          setVideoUploadPercentage(100);
          setTimeout(() => {
            alert(res.data.msg);
            setVideoUploadPercentage(0);
            setShow1(false);
          }, 2000);
          axios
            .get(
              `http://localhost:5000/videos/getVideoByUser/${userDetail._id}`
            )
            .then((res) => {
              if (res) {
                setVideo1(res.data);
                // console.log(res.data)
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [getUser, setUser] = useState({});
  useEffect(() => {
    console.log("executed once");
    async function getChannel() {
      await axios
        .get(`http://localhost:5000/channel/getChannel/${userDetail._id}`)
        .then((res) => {
          console.log(res.data);
          if (res) {
            setUser({
              channelName: res.data.channelName,
              channelDescription: res.data.channelDescription,
              channelId: res.data._id,
              imageUrl: res.data.userId.imageName,
            });
            setChannel(true);
            // window.location.reload();
            // console.log(res.data)
          }
        });
    }
    getChannel();
  }, []);

  const [getVideo, setVideo1] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/videos/getVideoByUser/${userDetail._id}`)
      .then((res) => {
        if (res) {
          setVideo1(res.data);
          // console.log(res.data)
        }
      });
  }, [userDetail._id]);
  return (
    <>
      <Header
        setLoginUser={setLoginUser}
        channel={channel}
        setChannel={setChannel}
      />
      {channel ? (
        <div
          style={{
            overflowY: "scroll",
            width: "98.4vw",
            height: "83.1vh",
            marginLeft: "48px",
            paddingLeft: "5px",
            // border: "1px solid red",
          }}
        >
          <div className="d-flex justify-content-end m-1 me-4">
            <button className="btn btn-danger" onClick={handleShowDelete}>
              Delete Channel{" "}
            </button>
            <Modal centered show={showModalDelete} onHide={handleCloseDelete}>
              <Modal.Body>
                <p>
                  Are you Sure you want to Delete?? If you select yes your
                  channel and videos uploaded by you will be deleted
                  Permanently.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    axios
                      .delete(
                        `http://localhost:5000/channel/updateChannel/${getUser.channelId}`
                      )
                      .then((res) => {
                        if (res) {
                          console.log(res);
                          setData({});
                          userDetail["channelName"] = false;
                          setChannel(!channel);
                          axios
                            .delete(
                              `http://localhost:5000/videos/deleteAllByUser/${userDetail._id}`
                            )
                            .then((result) => {
                              if (result) {
                                console.log(result);
                                setVideo1([]);
                                handleCloseDelete();
                                // window.location.reload();
                              }
                            });
                        }
                      });
                  }}
                >
                  Yes
                </button>
                <button
                  type="reset"
                  className="btn"
                  onClick={handleCloseDelete}
                >
                  No
                </button>
              </Modal.Footer>
            </Modal>

            <button className="d-flex ms-2 btn btn-dark" onClick={handleShow1}>
              <FiIcons.FiUpload className="me-1 mt-1" />
              Upload Video
            </button>
            <Modal show={showModal1} onHide={handleClose1}>
              <Modal.Header closeButton>
                <Modal.Title>Upload Video</Modal.Title>
              </Modal.Header>
              <form method="post" onSubmit={uploadVideo}>
                <Modal.Body>
                  <div className="text-start">
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        name="file"
                        id="file"
                        required
                        onChange={videoHandle}
                      />
                      {videoUploadPercentage > 0 && (
                        <ProgressBar
                          now={videoUploadPercentage}
                          striped={true}
                          label={`${videoUploadPercentage}%`}
                        />
                      )}
                      <div style={style}></div>
                      <label htmlFor="file">Title : </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        onChange={dataHandle}
                      />
                    </div>
                    <div style={style}>
                      <label htmlFor="file">Description : </label>
                      <textarea
                        name="description"
                        id="description"
                        cols="30"
                        rows="5"
                        required
                        onChange={dataHandle}
                      ></textarea>
                    </div>
                    <div style={style}>
                      <label htmlFor="category">Select Category: </label>
                      <select
                        name="category"
                        id="category"
                        required
                        onChange={dataHandle}
                      >
                        <option value={undefined} disabled selected>
                          Select Category
                        </option>
                        <option value="Education">Education</option>
                        <option value="Food">Food</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <button
                      className="btn mt-2 btn-dark"
                      style={{ marginLeft: "35%" }}
                      type="submit"
                    >
                      Upload Video
                    </button>
                  </div>
                </Modal.Body>
              </form>
            </Modal>
          </div>
          <hr />
          {Object.keys(getUser).length > 1 ? (
            <div className="d-flex m-1">
              {!getUser.imageUrl ? (
                <Avatar
                  facebookId="100008343750912"
                  className="border-1 rounded-circle"
                  size="50"
                />
              ) : (
                <img
                  className="border-1 rounded-circle"
                  src={`http://localhost:5000/${getUser.imageUrl}`}
                  alt=""
                  width={50}
                  height={50}
                />
              )}
              <div
                className="ms-2 pt-1"
                style={{ textAlign: "left", width: "90%" }}
              >
                <span>{getUser.channelName}</span>
                <br />
                <span>{getUser.channelDescription}</span>
              </div>
              {/* <div>
              {buttonText ? (
                <button
                  className="btn btn-secondary m-1 me-4"
                  // type="submit"
                  onClick={() => {
                    setButtonText(false);
                  }}
                >
                  Unsubscribe
                </button>
              ) : (
                <button
                  className="btn btn-danger m-1 me-4"
                  // type="submit"
                  onClick={() => {
                    setButtonText(true);
                  }}
                >
                  Subscribe
                </button>
              )}
            </div> */}
            </div>
          ) : (
            ""
          )}
          <hr />
          <div>
            {getVideo.map((video) => (
              <div
                className="d-flex mt-2"
                style={{ width: "98%" }}
                key={video._id}
              >
                <Link className="d-flex" to={`/single/${video._id}`}>
                  <video
                    className="border border-secondary"
                    // src={`http://localhost:5000/${video.url}.m3u8`}
                    style={{ width: "120px", height: "70px" }}
                    poster={
                      video.url
                        ? `http://localhost:5000/videos/${video.url}/${video.url}.png`
                        : ""
                    }
                  />
                  <div
                    className="ms-2 pt-1 text-dark"
                    style={{ textAlign: "left", width: "80%" }}
                  >
                    <p>{video.title}</p>
                    <p>{video.description}</p>
                  </div>
                </Link>
                <AiIcons.AiOutlineDelete
                  size={28}
                  style={{ display: "flex", marginLeft: "auto" }}
                  onClick={handleShow2}
                />
                <Modal
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  show={showModal2}
                  onHide={handleClose2}
                >
                  <Modal.Body closeButton>
                    <p>Are you Sure you want to Delete??</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        axios
                          .delete(
                            `http://localhost:5000/videos/delete/${video._id}`,
                            { data: { userId: userDetail._id } }
                          )
                          .then((res) => {
                            if (res) {
                              console.log(res);
                              setVideo1(res.data);
                              handleClose2();
                            }
                          });
                      }}
                    >
                      Yes
                    </button>
                    <button className="btn" onClick={handleClose2}>
                      No
                    </button>
                  </Modal.Footer>
                </Modal>

                <br />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <span style={{ fontSize: "48px" }}>
            You have to create Channel!!!
          </span>
        </div>
      )}
    </>
  );
};

export default ShowChannel;
