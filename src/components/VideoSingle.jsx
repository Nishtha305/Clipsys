import React, { useEffect, useRef } from "react";
import { useState } from "react";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";
import { Button, Modal } from "react-bootstrap";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../css/VideoSingle.css";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import Header from "./Header";

function VideoSingle({ setLoginUser, setChannel, channel }) {
  const playlistCheckbox = useRef(null);
  let params = useParams();
  const user = JSON.parse(localStorage.getItem("userDetail"));
  let [url, setUrl] = useState();
  const [getTitle, setTitle] = useState();
  const [getImage, setImage] = useState();
  const [getDescription, setDescription] = useState();
  const [getComment, setComment] = useState();
  const [getUser, setUser] = useState();
  const [buttonText, setButtonText] = useState(false);
  const [getvideos, setVideos] = useState([]);
  const [showModal, setShow] = useState(false);
  const [showPlaylistModal, setPlaylistModal] = useState(false);
  const [btnlike, setBtnLike] = useState(false);
  const [playlists, setPlaylist] = useState([]);
  const [value, setValue] = React.useState("");
  const [btnWatchLater, setbtnWatchLater] = useState(false);
  const [btnPlaylist, setbtnPlaylist] = useState(false);
  const [playlistValue, setPlaylistValue] = useState({});
  let [commentdata, setCommentData] = useState([]);

  const [like, setLike] = useState({
    like: 1,
  });

  const handleClose = () => setShow(false);
  const handleClosePlaylist = () => setPlaylistModal(false);
  const handleShow = () => setShow(true);
  const handleShowPlaylist = () => setPlaylistModal(true);
  const [playlistCheck, setCheck] = useState(false);

  //useEffect For Check the playlist hase the current video or not
  useEffect(() => {
    axios
      .get(`http://localhost:5000/playlist/palylisthasornot/${params._id}`)
      .then((res) => {
        if (res.data.length > 0) {
          console.log("video is already in playlist");
          setCheck(false);
        } else {
          console.log("video is not in playlist");
          setCheck(true);
        }
      });
  }, []);

  // let [play, setplay] = useState(false);

  useEffect(() => {
    let data = true;
    axios.get(`http://localhost:5000/videos/desc/lastTen`).then((res) => {
      if (data) {
        console.log(res.data);
        setVideos(res.data);
      }
    });
  }, []);

  //useEffect for get Watchlater
  useEffect(() => {
    axios
      .get(`http://localhost:5000/watchlater/getvideo/${params._id}`)
      .then((res) => {
        console.log("watchlater", res);
        if (res) {
          setbtnWatchLater(!btnWatchLater);
        }
      });
  }, []);

  //useEffect for play video
  useEffect(() => {
    axios.get(`http://localhost:5000/videos/${params._id}`).then((res) => {
      console.log(res);
      if (res) {
        setUrl(`${res.data.url}`);
        setTitle(`${res.data.title}`);
        setDescription(`${res.data.description}`);
        setImage(`${res.data.userId.imageName}`);
        setComment(res.data.commentId);
        setUser(res.data.userId.firstname);
        setLike({ like: res.data.videoLikes });
      }
    });
  }, []);

  //useEffect for get Playlist
  useEffect(() => {
    axios
      .get(`http://localhost:5000/playlist/getplaylistbyId/${user._id}`)
      .then((res) => {
        if (res) {
          console.log("Playlist:", res.data);
          setPlaylist(res.data);
        }
      });
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const playlistChange = (event) => {
    const { name, value } = event.target;
    setPlaylistValue({ [name]: value });
    console.log(playlistValue);
  };

  const createPlaylist = async () => {
    await axios
      .post(`http://localhost:5000/playlist/createplaylist`, {
        playlistName: playlistValue.playlistName,
        userId: user._id,
        videoId: params._id,
      })
      .then((res) => {
        if (res) {
          setPlaylist([...playlists, res.data.result]);
          alert(`${res.data.msg} & video added to playlist`);
        }
      });
  };

  const onChangeCheckboxTrue = async (e, playlistId) => {
    await axios
      .patch(`http://localhost:5000/playlist/updateplaylist/${playlistId}`, {
        videoId: params._id,
      })
      .then((res) => {
        if (res) {
          alert(res.data.msg);
          console.log(res.data.msg);
          playlistCheckbox.current.checked = true;
          setCheck(false);
        }
      });
  };
  const onChangeCheckboxFalse = async (e, playlistId) => {
    console.log("checkbox :", playlistCheck);
    // console.log("true aave to delete tha ne ghadheda");
    await axios
      .patch(
        `http://localhost:5000/playlist/deletefromplaylist/${playlistId}`,
        { videoId: params._id }
      )
      .then((res) => {
        if (res) {
          // console.log("Hu delete thayo");
          setCheck(true);
        }
      });
  };

  const onLike = async () => {
    if (!btnlike) {
      setLike({
        ...like,
        like: like.like + 1,
      });
      setBtnLike(!btnlike);
      console.log("hii");
      await axios
        .put("http://localhost:5000/videos/update/likes", {
          _id: `${params._id}`,
          likes: like.like + 1,
        })
        .then((res) => {
          console.log(res);
          if (res.modifiedCount === 1) {
            alert("yeaayyy you like the video hahaha....");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onDislike = async () => {
    if (btnlike) {
      setLike({
        ...like,
        like: like.like - 1,
      });
      // console.log(like.like);
      setBtnLike(!btnlike);
      await axios
        .put("http://localhost:5000/videos/update/likes", {
          _id: `${params._id}`,
          likes: like.like - 1,
        })
        .then((res) => {
          console.log(res);
          if (res.modifiedCount === 1) {
            alert("yeaayyy you like the video hahaha....");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleWatchLater = async () => {
    await axios
      .post("http://localhost:5000/watchlater/createwatchlater", {
        userId: user._id,
        videoId: params._id,
      })
      .then((res) => {
        console.log(res);
        if (res) {
          setbtnWatchLater(!btnWatchLater);
        }
      });
  };

  const removeWatchLater = async () => {
    // console.log(bt nWatchLater);
    await axios
      .delete(`http://localhost:5000/watchlater/deleteVideo/${params._id}`)
      .then((res) => {
        if (res) {
          setbtnWatchLater(!btnWatchLater);
          console.log(res.data);
        }
      });
  };
  const onComment = async () => {
    console.log(user._id);
    console.log(value);
    console.log(params._id);
    await axios
      .post("http://localhost:5000/comment/comment", {
        userId: user._id,
        videoId: params._id,
        text: value,
      })
      .then((res) => {
        console.log(res.data);
        setComment([...getComment, res.data]);
      });
    setValue("");
  };

  return (
    <div>
      <Header
        setLoginUser={setLoginUser}
        channel={channel}
        setChannel={setChannel}
      />
      <div
        className="row"
        style={{
          overflowY: "scroll",
          width: "98.4vw",
          height: "83.1vh",
          marginLeft: "48px",
          // border: "1px solid red",
        }}
      >
        <div className="col col-9 p-1 bg-light">
          <div className="">
            <video
              style={{}}
              id="my-video"
              class="video-js"
              className="bg-dark ratio ratio-16x9"
              controls
              width="auto"
              height="550"
              data-setup="{}"
              src={`http://localhost:5000/${url}.m3u8`}
              poster={`http://localhost:5000/${url}.png`}
            />
            <div className="d-flex ps-5 justify-content-between m">
              <p
                className="m-1 pt-3"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.15rem",
                  textTransform: "uppercase",
                }}
              >
                {getTitle}
              </p>
              <div className="d-flex">
                <span className="text-dark m-1 pt-3">
                  <strong style={{ fontSize: "1.25rem" }}>{like.like}</strong>
                </span>
                {btnlike ? (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Like">
                      <Button className="btn btn-light m-0 p-0">
                        <AiIcons.AiFillLike
                          size={28}
                          onClick={handleShow}
                          className="m-2"
                          onChange={() => {
                            console.log("onChange:", like.like);
                          }}
                        />
                      </Button>
                    </Tippy>
                  </span>
                ) : (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Like">
                      <Button className="btn btn-light m-0 p-0">
                        <AiIcons.AiOutlineLike
                          size={28}
                          className="m-2"
                          onClick={onLike}
                        />
                      </Button>
                    </Tippy>
                  </span>
                )}
                {!btnlike ? (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Dislike">
                      <Button className="btn btn-light m-0 p-0">
                        <AiIcons.AiFillDislike size={28} className="m-2" />
                      </Button>
                    </Tippy>
                  </span>
                ) : (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Dislike">
                      <Button className="btn btn-light m-0 p-0">
                        <AiIcons.AiOutlineDislike
                          size={28}
                          className="m-2"
                          onClick={onDislike}
                        />
                      </Button>
                    </Tippy>
                  </span>
                )}
                <span className="mt-2 mb-2">
                  <Tippy placement="bottom" arrow={false} content="Share">
                    <Button className="btn btn-light m-0 p-0">
                      <RiIcons.RiShareBoxLine
                        size={28}
                        onClick={handleShow}
                        className="m-2"
                      />
                    </Button>
                  </Tippy>
                </span>
                <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Share</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Tippy arrow={false} content="Share with Facebook">
                      <FacebookShareButton url="https://youtu.be/6d2wzfx4sRs">
                        <FacebookIcon
                          size={42}
                          round
                          className="m-2"
                        ></FacebookIcon>
                      </FacebookShareButton>
                    </Tippy>
                    <Tippy arrow={false} content="Share with Whatsapp">
                      <WhatsappShareButton url="http://localhost:3000/single">
                        <WhatsappIcon
                          size={42}
                          className="m-2"
                          round
                        ></WhatsappIcon>
                      </WhatsappShareButton>
                    </Tippy>

                    <Tippy arrow={false} content="Share with LinkedIn">
                      <LinkedinShareButton url="http://localhost:3000/single">
                        <LinkedinIcon
                          size={42}
                          className="m-2"
                          round
                        ></LinkedinIcon>
                      </LinkedinShareButton>
                    </Tippy>
                  </Modal.Body>
                </Modal>
                <div className="d-flex">
                  <span className="mt-2 mb-2">
                    <Tippy
                      placement="bottom"
                      arrow={false}
                      content="Add to Playlist"
                    >
                      <Button className="btn btn-light m-0 p-0">
                        <CgIcons.CgPlayListAdd
                          className="m-2"
                          size={28}
                          onClick={handleShowPlaylist}
                        />
                      </Button>
                    </Tippy>
                  </span>
                  <Modal show={showPlaylistModal} onHide={handleClosePlaylist}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create Playlist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="d-flex">
                        <input
                          name="playlistName"
                          style={{
                            height: "20px",
                            width: " 250px",
                            margin: "8px",
                          }}
                          type="text"
                          placeholder="Enter Playlist Name"
                          onChange={playlistChange}
                        />
                        <button
                          className="btn btn-dark px-3 py-0"
                          onClick={createPlaylist}
                        >
                          Create
                        </button>
                      </div>
                      <hr />
                      <div>
                        {playlists.map((playlist) => (
                          <>
                            <div>
                              <input
                                ref={playlistCheckbox}
                                type="checkbox"
                                name={playlist._id}
                                id={playlist._id}
                                value={playlist.playlistName}
                                onChange={(e) => {
                                  e.target.checked
                                    ? onChangeCheckboxTrue(e, playlist._id)
                                    : onChangeCheckboxFalse(e, playlist._id);
                                }}
                                // checked={playlistCheck ? false : true}
                              />
                              <label htmlFor={playlist._id}>
                                {playlist.playlistName}
                              </label>
                            </div>

                            {/* {console.log("map fun", playlist.playlistName)} */}
                          </>
                        ))}
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div
                  className="d-flex"
                  onClick={() => {
                    btnWatchLater ? removeWatchLater() : handleWatchLater();
                  }}
                >
                  <span className="mt-2 mb-2">
                    {btnWatchLater ? (
                      <Tippy
                        placement="bottom"
                        arrow={false}
                        content="Remove from Watchlater"
                      >
                        <Button className="btn btn-light m-0 p-0">
                          <MdIcons.MdWatchLater className="m-2" size={28} />
                        </Button>
                      </Tippy>
                    ) : (
                      <Tippy
                        placement="bottom"
                        arrow={false}
                        content="Add to Watchlater"
                      >
                        <Button className="btn btn-light m-0 p-0">
                          <MdIcons.MdOutlineWatchLater
                            className="m-2"
                            size={28}
                          />
                        </Button>
                      </Tippy>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <div className="d-flex">
              <img
                className="border-1 rounded-circle"
                src={`http://localhost:5000/${getImage}`}
                alt=""
                width={50}
                height={50}
              />
              <div
                className="ms-2 pt-2"
                style={{ textAlign: "left", width: "90%" }}
              >
                <span className="">{getUser}</span>
                <br />
                <br />
                <div className="">
                  <p>{getDescription}</p>
                </div>
              </div>

              <hr />
              <div>
                {buttonText ? (
                  <button
                    className="btn btn-secondary m-1 me-2"
                    // type="submit"
                    onClick={() => {
                      setButtonText(false);
                    }}
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    className="btn btn-danger m-1"
                    // type="submit"
                    onClick={() => {
                      setButtonText(true);
                    }}
                  >
                    Subscribe
                  </button>
                )}
              </div>
              <hr />
            </div>
          </div>
          <hr />
          <div>
            <input
              className="comment-btn "
              placeholder="Add a Comment..."
              value={value}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="reset"
              className="btn btn-dark m-1"
              onClick={() => {
                setValue("");
                // console.log(value);
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-dark m-1"
              disabled={!value}
              onClick={onComment}
            >
              Comment
            </button>
          </div>
          <hr />
          {/* {getComment.map((comment) => (
            <Comment
              getImage={getImage}
              videoId={params._id}
              text={comment.text}
            />
          ))} */}
          <Comment getImage={getImage} videoId={params._id} text={value} />
        </div>
        <div className="col-sm-3">
          <div
            className="d-flex flex-column mt-2"
            style={{ marginRight: "1rem" }}
          >
            {getvideos.map((video) => (
              <>
                <a
                  className="d-flex m-2 border text-dark"
                  href={`/single/${video._id}`}
                >
                  <div className="d-flex">
                    {/* {console.log(video)} */}
                    <video
                      style={{ width: "130px", height: "90px" }}
                      id="my-video"
                      // aut
                      className="video-js"
                      src={`http://localhost:5000/${video.url}`}
                    />
                    <div className="m-1">
                      <p
                        style={{
                          textAlign: "start",
                          fontSize: "1rem",
                          lineHeight: "1",
                        }}
                      >
                        {video.title}
                      </p>
                      <p
                        style={{
                          textAlign: "start",
                          fontSize: "0.75rem",
                          lineHeight: "1",
                        }}
                      >
                        {video.description}
                      </p>
                    </div>
                  </div>
                </a>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoSingle;
