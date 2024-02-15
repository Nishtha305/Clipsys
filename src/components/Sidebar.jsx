import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as CgIcons from "react-icons/cg";
import * as FiIcons from "react-icons/fi";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
// import * as GrIcons from "react-icons/gr";
import * as BsIcons from "react-icons/bs";
import "../css/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ children, setLoginUser }) => {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const history = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);
  const logout = async () => {
    localStorage.removeItem("userDetail");
    setLoginUser();
    history("/");
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <div className="main-container">
      <motion.div
        animate={{ width: isOpen ? "200px" : "48px" }}
        className="sidebar bg-dark"
      >
        <div className={isOpen ? "top_section open" : "top_section"}>
          <div className="bars">
            <FaIcons.FaBars onClick={toggle} />
          </div>
          {isOpen && (
            <motion.h1
              className="logo"
              variants={showAnimation}
              initial="hidden"
              animate="show"
              exit="hidden"
            ></motion.h1>
          )}
        </div>
        <section className="routes">
          <NavLink
            // activeClassName="active"
            to="/home"
            key="Home"
            // className="link"
            className={({ isActive }) =>
              isActive ? "active link" : "link inactive"
            }
          >
            <div className="icon">
              <AiIcons.AiOutlineHome />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  Home
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>

          <NavLink
            // activeClassName="active"
            to="/profile"
            key="Update Profile"
            // className="link"
            className={({ isActive }) =>
              isActive ? "active link" : "link inactive"
            }
          >
            <div className="icon">
              <CgIcons.CgProfile />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  Update Profile
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
          {userDetail.userType === "premiumUser" ? (
            <NavLink
              // activeClassName="active"
              to="/ShowChannel"
              key="Your Channel"
              // className="link"
              className={({ isActive }) =>
                isActive ? "active link" : "link inactive"
              }
            >
              <div className="icon">
                <AiIcons.AiOutlineDatabase />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="link_text"
                  >
                    Your Channel
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          ) : (
            ""
          )}

          <NavLink
            // activeClassName="active"
            to="/playlist"
            key="Playlist"
            // className="link"
            className={({ isActive }) =>
              isActive ? "active link" : "link inactive"
            }
          >
            <div className="icon">
              <RiIcons.RiPlayListFill />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  Playlist
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
          <NavLink
            // activeClassName="active"
            to="/Watchlater"
            key="Watch later"
            // className="link"
            className={({ isActive }) =>
              isActive ? "active link" : "link inactive"
            }
          >
            <div className="icon">
              <BsIcons.BsClock />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  Watch later
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
          <NavLink
          to="/ChannelSubscribe"
          key = 'Subscribe'
          className={({isActive})=>
          isActive ? "active link" : "link inactive"}>
            <div className="icon">
              <MdIcons.MdOutlineSubscriptions />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text">
                    Subscribed Channels
                  </motion.div>
              )}
            </AnimatePresence>
            
          </NavLink>
          <NavLink
            // activeClassName="active"
            to="/"
            key="Logout"
            // className="link"
            className={({ isActive }) =>
              isActive ? "active link" : "link inactive"
            }
            onClick={logout}
          >
            <div className="icon">
              <FiIcons.FiLogOut />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="link_text"
                >
                  Logout
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </section>
      </motion.div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
