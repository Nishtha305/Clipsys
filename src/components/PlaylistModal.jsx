import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import "../css/SinglePage.css";
import { Link, useParams } from "react-router-dom";

const PlaylistModal = ({
  showPlaylistModal,
  handleClosePlaylist,
  videoId,
  userId,
}) => {
  const playlistCheckbox = useRef(false);
  const [playlists, setPlaylist] = useState([]);
  let params = useParams();
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const [playlistValue, setPlaylistValue] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/playlist/getplaylistbyId/${userId}`)
      .then((res) => {
        if (res) {
          console.log("Playlist:", res.data);
          setPlaylist(res.data);
        }
      });
  }, []);

  const playlistChange = (event) => {
    const { name, value } = event.target;
    setPlaylistValue({ [name]: value });
    console.log(playlistValue);
  };
  const createPlaylist = async (e) => {
    e.preventDefault();
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
        videoId: videoId,
      })
      .then((res) => {
        if (res) {
          alert(res.data.msg);
          console.log(res.data.msg);
          playlistCheckbox.current.checked = true;
          //   setCheck(false);
        }
      });
  };
  const onChangeCheckboxFalse = async (e, playlistId) => {
    // console.log("checkbox :", playlistCheck);
    // console.log("true aave to delete tha ne ghadheda");
    await axios
      .patch(
        `http://localhost:5000/playlist/deletefromplaylist/${playlistId}`,
        { videoId: videoId }
      )
      .then((res) => {
        if (res) {
          console.log("Hu delete thayo");
          //   setCheck(true);
        }
      });
  };
  return (
    <>
      <Modal show={showPlaylistModal} onHide={handleClosePlaylist}>
        <Modal.Header closeButton>
          <Modal.Title>Create Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">
            <form
              method="post"
              onSubmit={(e) => {
                createPlaylist(e);
              }}
            >
              <input
                name="playlistName"
                style={{
                  height: "20px",
                  width: " 250px",
                  margin: "8px",
                }}
                type="text"
                placeholder="Enter Playlist Name"
                required
                onChange={playlistChange}
              />
              <button className="btn btn-dark px-3 py-0">Create</button>
            </form>
          </div>
          <hr />
          <div>
            {playlists.map((playlist) => (
              <div key={playlist._id}>
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
                <label htmlFor={playlist._id}>{playlist.playlistName}</label>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlaylistModal;
