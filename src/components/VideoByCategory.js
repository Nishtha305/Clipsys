import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Videocard from './Videocard'

const VideoByCategory = ({ setLoginUser }) => {
    let params = useParams();
    console.log(params);

    const [videos, setVideos] = useState([]);
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        if (params.c !== 'movie') {
            axios.get(`http://localhost:5000/videos/category/${params.c}`).then((res) => {
                if (res) {
                    setVideos(res.data);
                    // console.log(res);
                    setMovies([])
                }
            });
        } else {
            axios.get(`http://localhost:5000/movies/getAllMovies`).then(res => {
                if (res) {
                    setMovies(res.data);
                    // console.log(res.data);
                    setVideos([])
                }
            })

        }
    }, [params.c]);
    return (
        <div>
            <Header setLoginUser={setLoginUser} />
            <div
                style={{
                    overflowY: "scroll",
                    width: "98.4vw",
                    height: "83.1vh",
                    marginLeft: "48px",
                    // border: "1px solid red",
                }}
            >
                <div
                    className="d-flex flex-wrap justify-content-center"
                    style={{ width: "fit-content", gap: "2.5rem" }}
                >
                    {videos.map((video) => (
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
                    {movies.map((movie) => (
                        <div
                            className="m-1 align-self-center col-lg-3 col-md-3 col-sm-3 col-xs-6"
                            style={{ width: "19.5rem" }}
                            key={movie._id}
                        >
                            <Link
                                to={`/single/${movie._id}`}
                                className="col-lg-3 col-md-3 col-sm-3 col-xs-6 text-dark"
                            >
                                <div className="m-1">
                                    <div className="card effect">
                                        <video
                                            type="video/mp4"
                                            poster={`http://localhost:5000/movies/${movie.url}/${movie.url}.png`}
                                        // onMouseOver={(event) => event.target.play()}
                                        // onMouseOut={(event) => event.target.pause()}
                                        // loop
                                        ></video>
                                        <div className="card-body p-2 m-0">
                                            <p
                                                className="card-title text-dark"
                                                style={{
                                                    width: "220px",
                                                    height: "30px",
                                                    overflowX: "hidden",
                                                    overflowY: "hidden",
                                                }}
                                            >
                                                <strong>{movie.title}</strong>
                                            </p>

                                            <p
                                                className="card-text text-dark"
                                                style={{
                                                    width: "220px",
                                                    height: "30px",
                                                    overflowX: "hidden",
                                                    overflowY: "hidden",
                                                }}
                                            >
                                                {movie.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default VideoByCategory