import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as IoIcons from "react-icons/io";
import Header from "./Header";

const VideosByPlaylist = () => {
  const params = useParams();
  const [playlistVideo, setPlaylistVideo] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/playlist/getplaylistId/${params._id}`)
      .then((res) => {
        if (res) {
          console.log(res.data.videoId);
          setPlaylistVideo(res.data.videoId);
        }
      });
  }, [params._id]);

  return (
    <div>
      <Header />
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
          {playlistVideo.map((video) => (
            <div
              className="d-flex mt-2"
              style={{ width: "98%", marginRight: 'auto' }}
              key={video._id}
            >
              {/* {console.log("remaining video Id :", video)} */}
              <Link className="d-flex" to={`/single/${video._id}`}>
                <video
                  className="border border-secondary"
                  src={`http://localhost:5000/videos/${video.url}/${video.url}.m3u8`}
                  style={{ width: "120px", height: "70px" }}
                  poster={`http://localhost:5000/videos/${video.url}/${video.url}.png`}
                />
                <div
                  className="ms-2 pt-1 text-dark"
                  style={{ textAlign: "left", width: "80%" }}
                >
                  <p>{video.title}</p>
                  <p>{video.description}</p>
                </div>
              </Link>
              <IoIcons.IoMdRemoveCircleOutline
                size={28}
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: '20px',
                  cursor: "pointer",
                }}
                onClick={() => {
                  axios
                    .patch(
                      `http://localhost:5000/playlist/deletefromplaylist/${params._id}`,
                      { videoId: video._id }
                    )
                    .then((res) => {
                      if (res) {
                        console.log(res.data);
                        setPlaylistVideo(res.data.videoId);
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

export default VideosByPlaylist;
