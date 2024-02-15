import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../css/Login.css";
import "../css/Hero.css";
import { validateEmail, validatePassword } from "./Regex";
// import { notify } from "../../API/Routes/auth";

const Login = ({ setLoginUser }) => {
  let history = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);

  const [toggle, setToggle] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const chageHandle = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // const Notify = () =>{
  //   toast('Login Sucessful',{position: toast.POSITION.TOP_LEFT})
  // }

  const LoginUser = async (e) => {
    e.preventDefault();
    const { email, password } = user;
    if (!validateEmail.test(email) && !validatePassword.test(password)) {
      // alert(`Invalid creadintial 39`);
      setToggle(true);
    } else {
      if (email && password) {
        await axios
          .post("http://localhost:5000/auth/login", user)
          .then((res) => {
            if (res) {
              console.log(res.data);
              if (res.data.user) {
                localStorage.setItem(
                  "userDetail",
                  JSON.stringify(res.data.user)
                );

                if (res.data.user.userType.toLowerCase() === "admin") {
                  setTimeout(()=>{
                  setLoginUser(res.data.user);
                    history('/Dashboard')
                  },1000)
                } else if (res.data.msg === "Invalid Credential") {
                  history("/");
                  setLoginUser(res.data.user);
                  alert(`${res.data.msg}`);
                } else {
                  alert(`Welcome ${res.data.user.firstname}`);
                  setLoginUser(res.data.user);
                  history("/");
                  // alert(`${res.data.msg}`);
                }
              } else {
                setToggle(true);
              }
            }
          });
      } else {
        setToggle(true);
      }
    }
  };
  return (
    <div className="hero container-fluid">
      <div
        className={
          toggle
            ? "mt-5 alert alert-warning alert-dismissible fade show p-0 m-auto w-50"
            : "mt-5 alert alert-warning alert-dismissible fade p-0 m-auto w-50 "
        }
        role="alert"
      >
        <p className="mt-2 ">Invalid Username or password</p>
        <button
          type="button"
          className="btn-close btn1 mt-1 pe-3 p-2"
          onClick={() => {
            setToggle(false);
          }}
          aria-label="Close"
        ></button>
      </div>
      <div className="d-flex justify-content-center text-center align-center">
        <div
          className="mt-5 p-5 bg-light"
          style={{
            display: "flex",
            margin: "auto",
            padding: "auto",
            height: "300px",
          }}
        >
          <div className="">
            <h1 className="h3 mb-4 text-dark">Login Here!!</h1>
            <form
              method="post"
              onSubmit={(e) => {
                LoginUser(e);
              }}
            >
              <div>
                <input
                  style={{ width: "215px", height: "30px" }}
                  // className=" mb-3"
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={user.email}
                  onChange={chageHandle}
                  placeholder="Enter E-mail ID..."
                />
              </div>
              <div className="ps-1">
                <input
                  style={{ width: "210px", height: "30px" }}
                  className="ps-1"
                  type={passwordShown ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={user.password}
                  onChange={chageHandle}
                  placeholder="Enter Password..."
                />
                <i onClick={togglePassword}>
                  {passwordShown ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </i>
              </div>
              <div>
                <button
                  className="btn btn-secondary mt-2 p-4 pt-2 pb-2"
                  // data-bs-dismiss="alert" aria-label="Close"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
            {/* <hr/> */}
            <span className="text-black">Don't Have Account? </span>
            <Link to="/signup" className="text-dark">
              Click Here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
