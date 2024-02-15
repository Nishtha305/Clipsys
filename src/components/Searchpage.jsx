import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";

const Searchpage = ({ setLoginUser, setChannel, channel }) => {
  const params = useParams();
  const [searchs, setSearch] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/videos/search/${params.title}`)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setSearch(res.data);
        }
      });
  }, [params]);
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
        {searchs.length === 0 ? (
          <p className="h1">No Search Result </p>
        ) : (
          <div>
            {searchs.map((search) => (
              <div className="d-flex mt-2 p-2" style={{ width: "98%" }}>
                {/* {console.log("remaining video Id :", video)} */}
                <Link className="d-flex" to={`/single/${search._id}`}>
                  <video
                    className="border border-secondary"
                    src={`http://localhost:5000/${search.url}.m3u8`}
                    style={{ width: "200px", height: "130px" }}
                    poster={`http://localhost:5000/${search.url}.png`}
                  />
                  <div
                    className="ms-2 pt-1 text-dark"
                    style={{
                      textAlign: "left",
                      width: "80%",
                      fontSize: "1.5rem",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {search.title}
                    </p>
                    <p style={{ fontSize: "1.25rem" }}>{search.description}</p>
                  </div>
                </Link>
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchpage;
