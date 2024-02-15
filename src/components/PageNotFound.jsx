import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/pageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full err-container">
      <span className="err-junk">:: CNFG.CNSL </span>
      <span className="err-junk" style={{ color: "#626262" }}>
        04C
      </span>
      <span className="err-junk"> ::</span>
      <br />
      <br />
      <span className="err-status">Status </span>
      <span className="err-statuscode"> not found</span>
      <br />
      <br />
      <br />
      <br />
      <br />
      <span className="err-error">error</span>

      <hr />
      <span
        className="err-boxed"
        style={{ color: "#B4100B", letterSpacing: "normal" }}
      >
        <b>E</b>
      </span>
      <span className="err-boxed wht">404 ‏‏‎: ‎‎NOT FOUND</span>
      <span className="err-boxed red"></span>
      <span className="err-boxed"> ‏‏‎ ‎‎ ‏‏‎ ‎‎ ‏‏‎ ‎‎</span>
      {/* <!-- Yes, I had to use 'invisible spaces' (\u200f) and a lot of "<br>" and I am not very proud of that ... If you have some suggestions to enhance that, please tell me or fork my project :)--> */}
      <br />
      <br />
      <br />
      <br />

      <p
        className="err-link"
        onClick={() => {
          navigate("/");
        }}
      >
        [go back]
      </p>
    </div>
  );
};

export default PageNotFound;
