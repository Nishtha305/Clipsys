import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNav from "./AdminNav";
// import Footer from '../pages/Footer';
import "./Dashboard.css";

const Dashboard = ({ setLoginUser }) => {
  const [reportedVideos, setReportedVideos] = useState([]);
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/videos/get/reported/videos")
      .then((res) => {
        if (res) {
          console.log(res.data);
          setReportedVideos(res.data);
        }
      });
  }, []);
  useEffect(() => {
    axios.get("http://localhost:5000/movies/getAllMovies").then((res) => {
      if (res) {
        console.log(res.data);
        setMovies(res.data);
      }
    });
  }, []);
  return (
    <>
      <AdminNav setLoginUser={setLoginUser} />
      <div className="dash container-fluid">
        <div className="cover">
          <span className="h1 align-start">Reported Videos</span>
          <div className="">
            <table class="table table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Title</th>
                  <th scope="col">Username</th>
                  <th scope="col">Uploaded At</th>
                  <th scope="col">Category</th>
                  <th scope="col">Report Count</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {reportedVideos.map((reports, index) => (
                  <tr>
                    <>
                      <td>{index + 1}</td>
                      <td>
                        <Link className="" to={`/single/${reports._id}`}>
                          {reports.title}
                        </Link>{" "}
                      </td>
                      <td>{reports.userId.firstname}</td>
                      <td>{reports.uploadedAt}</td>
                      <td>{reports.category}</td>
                      <td>
                        {Array.isArray(reports.report)
                          ? reports.report.length
                          : 0}
                      </td>
                      <td>
                        <button
                          className="btn text-danger m-0 p-0"
                          onClick={() => {
                            axios
                              .delete(
                                `http://localhost:5000/videos/admin/delete/${reports._id}`
                              )
                              .then((res) => {
                                if (res) {
                                  // console.log(res);
                                  setReportedVideos(res.data);
                                }
                              });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="">
            <span className="h1 align-start pb-2">List of Movies</span>
            <div className="">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">Sr. No.</th>
                    <th scope="col">Title</th>
                    <th scope="col">Username</th>
                    <th scope="col">Uploaded At</th>
                    <th scope="col">Category</th>
                    <th scope="col">Report Count</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie, index) => (
                    <tr key={movie._id}>
                      <>
                        <td>{index + 1}</td>
                        <td>
                          <Link className="" to={`/single/${movie._id}`}>
                            {movie.title}
                          </Link>{" "}
                        </td>
                        <td>{movie.userId.firstname}</td>
                        <td>{movie.uploadedAt}</td>
                        <td>{movie.category}</td>
                        <td>
                          {Array.isArray(movies.report)
                            ? movies.report.length
                            : 0}
                        </td>
                        <td>
                          <button
                            className="btn text-danger m-0 p-0"
                            onClick={() => {
                              axios
                                .delete(
                                  `http://localhost:5000/movies/delete/${movie._id}`
                                )
                                .then((res) => {
                                  if (res) {
                                    // console.log(res);
                                    setReportedVideos(res.data);
                                  }
                                });
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default Dashboard;
