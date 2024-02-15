import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { Link } from "react-router-dom";
import * as IoIcons from "react-icons/io";

const WatchLater = ({ setLoginUser, setChannel, channel }) => {
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const [watchLater, setWatchLater] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/watchlater/get/watchlater/${user._id}`)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setWatchLater(res.data);
        }
      });
  }, []);

  return (
    <div>
      <Header
        setLoginUser={setLoginUser}
        channel={channel}
        setChannel={setChannel}
      />
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
        <div>
          {watchLater.map((video) => (
            <div
              className="d-flex mt-2"
              style={{ width: "98%", marginRight: "auto" }}
            >
              {console.log("Watch later:", video)}
              <Link className="d-flex" to={`/single/${video.videoId._id}`}>
                <video
                  className="border border-secondary"
                  src={`http://localhost:5000/videos/${video.videoId.url}/${video.videoId.url}.m3u8`}
                  poster={`http://localhost:5000/videos/${video.videoId.url}/${video.videoId.url}.png`}
                  style={{ width: "120px", height: "70px" }}
                />
                <div
                  className="ms-2 pt-1 text-dark"
                  style={{ textAlign: "left", width: "80%" }}
                >
                  <p>{video.videoId.title}</p>
                  <p>{video.videoId.description}</p>
                </div>
              </Link>
              <IoIcons.IoMdRemoveCircleOutline
                size={28}
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "20px",
                }}
                onClick={() => {
                  axios
                    .delete(
                      `http://localhost:5000/watchlater/delete/${video._id}`,
                      { userId: user._id }
                    )
                    .then((res) => {
                      if (res) {
                        console.log(res.data);
                        setWatchLater(res.data);
                      }
                    });
                }}
              />
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchLater;
