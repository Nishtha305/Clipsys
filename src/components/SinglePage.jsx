import React, { useEffect, useRef } from "react";
import { useState } from "react";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";
import { Button } from "react-bootstrap";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../css/VideoSingle.css";
import ShareModal from "./ShareModal";
import PlaylistModal from "./PlaylistModal";
// import Hls from "hls.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/SinglePage.css";
import Comment from "./Comment";
import Header from "./Header";
import Avatar from "react-avatar";
import VideoPlayer from "./VideoPlayer";
import MovieModal from "./MovieModal";

const SinglePage = ({ setLoginUser, setChannel, channel }) => {
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const params = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUploaderImage, setVideoUploaderImage] = useState("");
  const [videoUploaderName, setVideoUploaderName] = useState("");
  const [btnWatchLater, setbtnWatchLater] = useState(false);
  const [showShareModal, setShareShow] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [showPlaylistModal, setPlaylistModal] = useState(false);
  const [btnlike, setBtnLike] = useState(false);
  const [getvideos, setVideos] = useState([]);
  const [getMovieModal, setMovieModal] = useState(false);
  const [getChannel, setChannels] =useState({})
  // const [videoQuality, setVideoQuality] = useState(false);
  const [reports, setReport] = useState(false);
  const [videoLike, setVideoLike] = useState({
    like: 1,
  });
  const [movieUrl, setMovieUrl] = useState(false);

  // below useEffect for setting videoUrl and title, description
  useEffect(() => {
    axios.get(`http://localhost:5000/videos/${params._id}`).then((res) => {
      // console.log("video 1:", res.data.length);
      if (res.data !== "") {
        // console.log("video:-> ", res.data);
        setVideoUrl(`${res.data.url}`);
        setVideoTitle(`${res.data.title}`);
        setVideoDescription(`${res.data.description}`);
        setVideoLike({ like: res.data.videoLikes });
        setVideoUploaderImage(`${res.data.userId.imageName}`);
        setVideoUploaderName(res.data.userId.firstname);
      } else {
        axios
          .get(`http://localhost:5000/movies/getMovieById/${params._id}`)
          .then((res) => {
            // console.log("movie :-> ", res);
            if (res.data) {
              if(JSON.parse(localStorage.getItem('userDetail')).userType === 'user'){
                console.log('hello user');
                setMovieModal(true);
                
              }else{
              // console.log("movie :-> ", res.data.url);
              setVideoUrl(`${res.data.url}`);
              setVideoTitle(`${res.data.title}`);
              setVideoDescription(`${res.data.description}`);
              setVideoLike({ like: res.data.videoLikes });
              setVideoUploaderImage(`${res.data.userId.imageName}`);
              setVideoUploaderName(res.data.userId.firstname);
              setMovieUrl(true);
            }
            }
          })
          .catch((err) => {
            console.log("Error :", err);
          });
      }
    });
  }, [params._id]);

  //useEffect to check video is Reported or not
  useEffect(() => {
    axios
      .post(`http://localhost:5000/report/reported/${user._id}`, {
        videoId: params._id,
      })
      .then((res) => {
        if (res) {
          // console.log(res.data);
          setReport(res.data.reported);
        }
      });
  }, []);

  //useEffect for get Watchlater
  useEffect(() => {
    axios
      .post(`http://localhost:5000/watchlater/getvideo/${params._id}`, {
        userId: user._id,
      })
      .then((res) => {
        // console.log("watchlater", res);
        if (res) {
          setbtnWatchLater(true);
        }
      });
  }, []);

  //useEffect for get subscribed channel list
   useEffect(()=>{
    axios
    .get(`http://localhost:5000/subscribe/getchannellistid/${params._id}`)
    .then(res =>{
      if(res.data){

      console.log("data",res.data);
      setChannels(res.data)
      axios
      .post(`http://localhost:5000/subscribe/checksubscriber`,{
        userId: user._id,
        channelId : res.data._id
      }).then(res =>{
        console.log(res.data);
        setSubscribe(res.data)
      })
    }
    })
  },[])

  //useEffect for side videobar
  useEffect(() => {
    let data = true;
    axios.get(`http://localhost:5000/videos/desc/lastTen`).then((res) => {
      if (data) {
        // console.log(res.data);
        setVideos(res.data);
      }
    });
  }, []);

  const handleShareClose = () => setShareShow(false);
  const handleClosePlaylist = () => setPlaylistModal(false);
  const handleShareShow = () => setShareShow(true);
  const handleShowPlaylist = () => setPlaylistModal(true);

  const handleWatchLater = async () => {
    await axios
      .post("http://localhost:5000/watchlater/createwatchlater", {
        userId: user._id,
        videoId: params._id,
      })
      .then((res) => {
        // console.log(res);
        if (res) {
          setbtnWatchLater(true);
        }
      });
  };

  const removeWatchLater = async () => {
    await axios
      .delete(`http://localhost:5000/watchlater/deleteVideo/${params._id}`)
      .then((res) => {
        if (res) {
          setbtnWatchLater(false);
          // console.log(res.data);
        }
      });
  };

  const onSubscribe = async() =>{
    await 
    axios.post("http://localhost:5000/subscribe/channel",{
      userId: user._id,
      channelId: getChannel._id
    })
    .then((res)=>{
      if(res){
        setSubscribe(true)
        console.log(res);
      }
    })
  }

  const onUnsubscribe = async()=>{
    await
    axios.delete(`http://localhost:5000/subscribe/unsubscribe/`,
    {data:{ channelId: getChannel._id,
    userId: user._id}
  })
    .then((res)=>{
      if(res){
        setSubscribe(false)
        console.log(res);
      }
    })
  }

  const onLike = async () => {
    if (!btnlike) {
      setVideoLike({
        ...videoLike,
        like: videoLike.like + 1,
      });
      setBtnLike(!btnlike);
      // console.log("hii");
      await axios
        .put("http://localhost:5000/videos/update/likes", {
          _id: `${params._id}`,
          likes: videoLike.like + 1,
        })
        .then((res) => {
          // console.log(res);
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
      setVideoLike({
        ...videoLike,
        like: videoLike.like - 1,
      });
      // console.log(like.like);
      setBtnLike(!btnlike);
      await axios
        .put("http://localhost:5000/videos/update/likes", {
          _id: `${params._id}`,
          likes: videoLike.like - 1,
        })
        .then((res) => {
          // console.log(res);
          if (res.modifiedCount === 1) {
            alert("yeaayyy you like the video hahaha....");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onReport = (e) => {
    axios
      .post(`http://localhost:5000/report/report`, {
        videoId: params._id,
        userId: user._id,
      })
      .then((res) => {
        console.log(res);
        setReport(true);
      });
  };

  return (
    <div>
      <Header
        setLoginUser={setLoginUser}
        channel={channel}
        setChannel={setChannel}
      />
      {getMovieModal ? <MovieModal 
        getMovieModal={getMovieModal}
        setMovieModal={setMovieModal} 
      />
    :''}
      <div
        className="row"
        style={{
          overflowY: "scroll",
          width: "98.4vw",
          height: "83.1vh",
          marginLeft: "48px",
        }}
      >
        <div className="col col-9 p-1 bg-light">
          <div>
            {/* <video
              ref={player}
              style={{}}
              id="video my-video"
              className="video-js bg-dark ratio ratio-16x9"
              width="auto"
              controls
              height="550"
              data-setup="{}"
              poster={
                videoUrl
                  ? `http://localhost:5000/videos/${videoUrl}/${videoUrl}.png`
                  : ""
              } 
            />*/}
            <VideoPlayer url={videoUrl} movieUrl={movieUrl} />
            <div className="d-flex ps-5 justify-content-between m">
              <p
                className="m-1 pt-3"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.15em",
                  textTransform: "uppercase",
                }}
              >
                {videoTitle}
              </p>
              <div className="d-flex">
                <span className="text-dark m-1 pt-3">
                  <strong style={{ fontSize: "1.25rem" }}>
                    {videoLike.like}
                  </strong>
                </span>
                {btnlike ? (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Like">
                      <Button className="btn btn1 btn-light m-0 p-0">
                        <AiIcons.AiFillLike
                          size={28}
                          // onClick={handleShow}
                          className="m-2"
                          onChange={() => {
                            console.log("onChange:", videoLike.like);
                          }}
                        />
                      </Button>
                    </Tippy>
                  </span>
                ) : (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Like">
                      <Button className="btn btn1 btn-light m-0 p-0">
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
                      <Button className="btn btn1 btn-light m-0 p-0">
                        <AiIcons.AiFillDislike size={28} className="m-2" />
                      </Button>
                    </Tippy>
                  </span>
                ) : (
                  <span className="mt-2 mb-2">
                    <Tippy placement="bottom" arrow={false} content="Dislike">
                      <Button className="btn btn1 btn-light m-0 p-0">
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
                    <Button className="btn btn1 btn-light m-0 p-0">
                      <RiIcons.RiShareBoxLine
                        size={28}
                        onClick={handleShareShow}
                        className="m-2"
                      />
                    </Button>
                  </Tippy>
                </span>
                <ShareModal
                  showShareModal={showShareModal}
                  closeShareModal={handleShareClose}
                />
                {/* write shareModal Here */}
                <div className="d-flex">
                  <span className="mt-2 mb-2">
                    <Tippy
                      placement="bottom"
                      arrow={false}
                      content="Add to Playlist"
                    >
                      <Button className="btn btn1 btn-light m-0 p-0">
                        <CgIcons.CgPlayListAdd
                          className="m-2"
                          size={28}
                          onClick={handleShowPlaylist}
                        />
                      </Button>
                    </Tippy>
                  </span>
                  <PlaylistModal
                    userId={user._id}
                    videoId={params._id}
                    showPlaylistModal={showPlaylistModal}
                    handleClosePlaylist={handleClosePlaylist}
                  />
                  {/* Write Playlist Modal Here */}
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
                        <Button className="btn btn1 btn-light m-0 p-0">
                          <MdIcons.MdWatchLater className="m-2" size={28} />
                        </Button>
                      </Tippy>
                    ) : (
                      <Tippy
                        placement="bottom"
                        arrow={false}
                        content="Add to Watchlater"
                      >
                        <Button className="btn btn1 btn-light m-0 p-0">
                          <MdIcons.MdOutlineWatchLater
                            className="m-2"
                            size={28}
                          />
                        </Button>
                      </Tippy>
                    )}
                  </span>
                </div>
                <div className="d-flex">
                  {reports ? (
                    <span className="mt-2 mb-2">
                      {/* {reported ? } */}
                      <Tippy
                        placement="bottom"
                        arrow={false}
                        content="Reported"
                      >
                        <Button className="btn btn1 btn-light m-0 p-0" disabled>
                          <MdIcons.MdReport
                            className="m-2"
                            size={28}
                          // onClick={onReport}
                          />
                        </Button>
                      </Tippy>
                    </span>
                  ) : (
                    <span className="mt-2 mb-2">
                      {/* {reported ? } */}
                      <Tippy
                        placement="bottom"
                        arrow={false}
                        content="Report A Video"
                      >
                        <Button className="btn btn1 btn-light m-0 p-0">
                          <MdIcons.MdReport
                            className="m-2"
                            size={28}
                            onClick={onReport}
                          />
                        </Button>
                      </Tippy>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className="d-flex">
              {!videoUploaderImage ? (
                <Avatar
                  facebookId="100008343750912"
                  className="border-1 ms-1 mt-1 rounded-circle"
                  size="50"
                />
              ) : (
                <img
                  className="border-1 rounded-circle"
                  src={`http://localhost:5000/${videoUploaderImage}`}
                  alt=""
                  width={50}
                  height={50}
                />
              )}
              <div
                className="ms-2 pt-2"
                style={{ textAlign: "left", width: "90%" }}
              >
                <span className="">{getChannel.channelName}</span>
                <br />
                <br />
                <div className="">
                  <p>{videoDescription}</p>
                </div>
              </div>
              <div className="ms-2 pt-2"
                style={{ textAlign: 'right' }}>
                {subscribe ? (
                  <button
                    className="btn btn-secondary m-1 me-2"
                    // type="submit"
                    onClick={() => {
                      // setSubscribe(false);
                      onUnsubscribe()
                    }}
                  >
                    Unsubscribe
                  </button>
                ) : (
                <button
                  className="btn btn-danger m-1"
                  // type="submit"
                  onClick={onSubscribe}
                >
                  Subscribe
                </button>
                )}

              </div>
              <hr />
            </div>
            <hr />
            <div>
              <Comment userId={user._id} videoId={params._id} />
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div
            className="d-flex flex-column mt-2"
            style={{ marginRight: "1rem" }}
          >
            {getvideos.map((video) => (
              <div key={video._id}>
                <a
                  className="d-flex m-2 border text-dark"
                  href={`/single/${video._id}`}
                >
                  <div className="d-flex">
                    {/* {console.log(video)} */}
                    <video
                      style={{ width: "130px", height: "90px" }}
                      id="video my-video"
                      className="video-js"
                      // src={`http://localhost:5000/${video.url}`}
                      poster={
                        video.url
                          ? `http://localhost:5000/videos/${video.url}/${video.url}.png`
                          : ""
                      }
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
