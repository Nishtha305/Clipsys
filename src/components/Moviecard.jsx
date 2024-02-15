import React from "react";
function content({ url, title, description }) {
  return (
    <div className="m-1">
      <div className="card effect">
        <video
          // src={`http://localhost:5000/${url}.m3u8`}
          type="video/mp4"
          poster={`http://localhost:5000/movies/${url}/${url}.png`}
          // onMouseOver={(event) => event.target.play()}
          // onMouseOut={(event) => event.target.pause()}
          // loop
          muted
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
            <strong>{title}</strong>
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
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default content;
