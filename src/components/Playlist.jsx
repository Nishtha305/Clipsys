import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as IoIcons from "react-icons/io";
import Header from "./Header";
import axios from "axios";

const Playlist = ({ setLoginUser, setChannel, channel }) => {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [playList, setPlayList] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/playlist/getplaylistbyId/${userDetail._id}`)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setPlayList(res.data);
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
          <div className="card-body mx-3">
            <ul className="list-group list-group-flush">
              {playList.map((playlist) => (
                <div
                  className="d-flex border rounded bg-light"
                  key={playList._id}
                >
                  <Link to={`/playlist/${playlist._id}`}>
                    <li className="list-group-item bg-light border-white text-start">
                      {playlist.playlistName} <br />
                      <span>
                        Videos{" "}
                        {Array.isArray(playlist.videoId)
                          ? playlist.videoId.length
                          : 0}
                      </span>
                    </li>
                  </Link>
                  <IoIcons.IoMdRemoveCircleOutline
                    size={28}
                    style={{
                      display: "flex",
                      marginLeft: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      axios
                        .delete(
                          `http://localhost:5000/playlist/deletePlaylist/${playlist._id}`,
                          { userId: userDetail._id }
                        )
                        .then((res) => {
                          if (res) {
                            console.log(res.data);
                            setPlayList(res.data);
                          }
                        });
                    }}
                  />
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
