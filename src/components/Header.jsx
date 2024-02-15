import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react";
import Category from "./Category";
import "../css/sidebar.css";

const Header = ({ setLoginUser, setChannel, channel }) => {
  const userType = JSON.parse(localStorage.getItem("userDetail")).userType;
  // console.log(userType);
  return (
    <>
      <div className="row">
        <div className="col-auto">
          <Sidebar setLoginUser={setLoginUser} />
        </div>
        <div
          className="bg-dark"
          style={{ width: "98.4vw", marginLeft: "48px" }}
        >
          <Navbar
            setLoginUser={setLoginUser}
            setChannel={setChannel}
            channel={channel}
          />
          <div
            className="bg-dark d-flex justify-content-around"
            style={{
              color: "white",
              gap: "10px",
              margin: "9.9vh 10px -1px 10px",
              padding: "5px 0px",
              overflowX: "scroll",
            }}
          >
            <Category categoryName={"Home"} />
            <Category categoryName={"Comedy"} />
            <Category categoryName={"Health"} />
            <Category categoryName={"Education"} />
            <Category categoryName={"movie"}/>
            {/* {userType === "premiumUser" && <Category categoryName={"movie"} />} */}
            <Category categoryName={"Food"} />
            <Category categoryName={"Other"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
