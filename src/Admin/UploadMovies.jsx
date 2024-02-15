import axios from "axios";
import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import AdminNav from "./AdminNav";
import "./UploadMovies.css";

function UploadMovies({setLoginUser}) {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [video, setVideo] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const videoHandle = (e) => {
    setVideo(e.target.files[0]);
  };
  const dataHandle = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const [videoUploadPercentage, setVideoUploadPercentage] = useState(0);
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
    formData.append("category", "movie");
    formData.append("email", userDetail.email);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    await axios
      .post("http://localhost:5000/movies/upload", formData, options, config)
      .then((res) => {
        setVideoUploadPercentage(100);
        setTimeout(() => {
          alert(res.data.msg);
          setVideoUploadPercentage(0);
          setData({ title: "", description: "" });
          setVideo(null);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <AdminNav setLoginUser={setLoginUser}/>
      <div className="">
        <form method="post" onSubmit={uploadVideo}>
          <div className="p-5 mt-5">
            <h1 className="h3 mb-4 text-dark">Upload Movie!!</h1>
            <div>
              <input
                className="ps-2 mb-3"
                type="text"
                name="title"
                id="title"
                placeholder="Movie title"
                onChange={dataHandle}
                required
              />
            </div>
            <div>
              <textarea
                className="ps-1 mb-2"
                type="text"
                name="description"
                id="description"
                placeholder="Movie Description"
                onChange={dataHandle}
                required
              />
            </div>
            <div class="form-group mt-3">
              <label class="mr-2">Upload Movie:</label>
              <input
                className="inline"
                type="file"
                name="file"
                accept="video/.mp4,video/.mkv"
                placeholder="Upload Movie"
                onChange={videoHandle}
                required
              />
            </div>
            {videoUploadPercentage > 0 && (
              <ProgressBar
                now={videoUploadPercentage}
                active
                label={`${videoUploadPercentage}%`}
              />
            )}
            <div>
              <button
                className="btn btn-primary mt-4 p-4 pt-2 pb-2"
                type="submit"
              >
                Upload Movie
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* <Footer/> */}
    </>
  );
}

export default UploadMovies;
