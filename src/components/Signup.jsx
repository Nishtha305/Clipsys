import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import "../css/Hero.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  validateContact,
  validateEmail,
  validateName,
  validatePassword,
} from "./Regex";

const Signup = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown1, setPasswordShown1] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const togglePassword1 = () => {
    setPasswordShown1(!passwordShown1);
  };

  const [toggle, setToggle] = useState(false);

  let history = useNavigate();
  let type = "password";
  const [user, setUser] = useState({
    firstname: "",
    email: "",
    contactNumber: "",
    password: "",
    cpassword: "",
  });
  const showPassword = () => {
    if (type === "password") {
      type = "text";
    } else {
      type = "password";
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const [errors, setErrors] = useState([]);

  const register = (e) => {
    e.preventDefault();
    if (!user.firstname) {
      setErrors(["Name Required!"]);
      console.log(errors);
      setToggle(true);
    } else if (!validateName.test(user.firstname)) {
      setErrors(["Name must contain only 2 or more characters"]);
      setToggle(true);
    } else {
      setErrors([]);
    }
    if (!user.email) {
      setErrors(["Email Required!"]);
      setToggle(true);
    } else if (!validateEmail.test(user.email)) {
      setErrors(["Email address invalid!"]);
      setToggle(true);
    } else {
      setErrors([]);
    }
    if (!user.contactNumber) {
      setErrors(["contact number required!"]);
      setToggle(true);
    } else if (!validateContact.test(user.contactNumber)) {
      setErrors(["contact number must be only 10 digits!"]);
      setToggle(true);
    } else {
      setErrors([]);
    }
    //numbers and characters
    if (!user.password) {
      setErrors(["Password Is Required!"]);
      setToggle(true);
    } else if (!validatePassword.test(user.password)) {
      setErrors(["Password must conatin 6 characters with digits"]);
      setToggle(true);
    } else if (user.password !== user.cpassword) {
      setErrors(["password does not match!"]);
      setToggle(true);
    } else {
      setErrors([]);
    }
    // console.log("errors:", errors.length);
    // console.log("errors:", errors);
    // console.log("users:", user);
    if (errors.length < 1) {
      axios
        .post("http://localhost:5000/auth/signup", user)
        .then((res) => {
          // <Link to="/"></Link>;
          history("/");
          alert(res.data.msg);
          console.log(res);
          setErrors([]);
          setToggle(true);
        })
        .catch((err) => {
          console.log(err);
          setToggle(true);
        });
    } else {
      // alert(`All details are Required`);
      setToggle(true);
    }
  };

  return (
    <div className="hero container-fluid ">
      <div
        className={
          toggle
            ? "alert alert-warning alert-dismissible fade show p-0 m-auto w-50"
            : "alert alert-warning alert-dismissible fade p-0 m-auto w-50 "
        }
        role="alert"
      >
        <p>{errors[0]}</p>
        <button
          type="button"
          className="btn-close btn1 mt-1 pe-3 p-2"
          onClick={() => {
            setToggle(false);
          }}
          aria-label="Close"
        ></button>
      </div>
      <div className="row">
        <div className="col-3-md-12">
          <div className="d-flex justify-content-center text-center ">
            <div className=" mt-5 p-5 bg-light">
              <div>
                <div>
                  <h1 className="h3 text-dark">Signup to ClipSys</h1>
                  <form method="post" onSubmit={register}>
                    <div>
                      <input
                        style={{ width: "215px", height: "23px" }}
                        type="text"
                        name="firstname"
                        value={user.name}
                        id="name"
                        onChange={handleChange}
                        placeholder="Enter Name..."
                        required
                      />
                    </div>

                    <div>
                      <input
                        className="ps-2"
                        style={{ width: "215px", height: "23px" }}
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        id="email"
                        placeholder="Enter Email ID..."
                        required
                      />
                    </div>
                    <div className="ps-4" style={{ height: "33px" }}>
                      <input
                        style={{ width: "215px", height: "30px" }}
                        name="password"
                        className="ps-2"
                        value={user.password}
                        onChange={handleChange}
                        type={passwordShown ? "text" : "password"}
                        id="password"
                        placeholder="Enter Password..."
                        required
                      />
                      <i onClick={togglePassword}>
                        {passwordShown ? (
                          <AiOutlineEye />
                        ) : (
                          <AiOutlineEyeInvisible />
                        )}
                      </i>
                    </div>
                    <div className="ps-4">
                      <input
                        className="ps-2"
                        style={{ width: "215px", height: "30px" }}
                        name="cpassword"
                        value={user.cpassword}
                        onChange={handleChange}
                        type={passwordShown1 ? "text" : "password"}
                        id="cpassword"
                        placeholder="Confirm Password..."
                        required
                      />
                      <i onClick={togglePassword1}>
                        {passwordShown1 ? (
                          <AiOutlineEye />
                        ) : (
                          <AiOutlineEyeInvisible />
                        )}
                      </i>
                    </div>
                    <input
                      style={{ width: "215px", height: "23px" }}
                      name="contactNumber"
                      value={user.contactNumber}
                      onChange={handleChange}
                      type="text"
                      id="contactNumber"
                      placeholder="Enter Contact Number..."
                      required
                    />
                    <br />
                    <div>
                      <button className="btn btn-secondary mt-2 p-5 pt-2 pb-2">
                        Register
                      </button>
                    </div>
                  </form>
                  <hr />
                  <span className="text-black">Already have Account? </span>
                  <Link to="/" className="text-dark">
                    Click here!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
