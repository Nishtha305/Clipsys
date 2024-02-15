import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "../css/videocard.css";
import Videocard from "./Videocard";
import Moviecard from "./Moviecard";

const Home = ({ setLoginUser, setChannel, channel }) => {
  const [videos, setVideos] = useState([]);
  const [movies, setMovies] = useState([]);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    let datas = true;
    axios.get("http://localhost:5000/videos/").then((res) => {
        console.log(res.data);
        setVideos(res.data);
      
    });
    axios.get(`http://localhost:5000/movies/getAllMovies`).then((res) => {
      
        setMovies(res.data);
        console.log('movies:',res.data);
      
    });
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/videos/trending").then((res) => {
      if (res) {
        setTrend(res.data);
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
          // border: "1px solid red",
        }}
      >
        <div>
          <h3 className="h4 text-weight-200 ">TRENDING</h3>
        </div>
        <div
          className="d-flex flex-wrap justify-content-center"
          style={{ width: "fit-content", gap: "2.5rem" }}
        >
          {trend.map((video) => (
            <div
              className="m-1 align-self-center col-lg-3 col-md-3 col-sm-3 col-xs-6"
              style={{ width: "19.5rem" }}
              key={video._id}
            >
              <Link
                to={`/single/${video._id}`}
                className="col-lg-3 col-md-3 col-sm-3 col-xs-6"
              >
                <Videocard
                  url={video.url}
                  title={video.title}
                  description={video.description}
                />
              </Link>
            </div>
          ))}
        </div>
        <div className="container bg-transparent justify-content-start text-black ">
          <h3 className="h4 text-weight-200">MOVIES</h3>
          <br />
        </div>
        <div
          className="d-flex justify-content-center flex-wrap "
          style={{ width: "auto", gap: "2.5rem" }}
        >
          {movies.map((movie) => (
            <div
              className="m-1 align-self-center col-lg-3 col-md-3 col-sm-3 col-xs-6"
              style={{ width: "19.5rem" }}
            >
              <Link to={`/single/${movie._id}`}>
                <Moviecard
                  url={movie.url}
                  title={movie.title}
                  description={movie.description}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
