import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { validateContact, validateName, validatePassword } from "./Regex";
import Avatar from "react-avatar";
// import Navbar from "../Navbar/Navbar";
// import Sidebar from "../Sidebar/Sidebar";
// import Footer from "./Footer";

const Profile = ({ setLoginUser, setChannel, channel }) => {
  const user = JSON.parse(localStorage.getItem("userDetail"));
  // console.table(user.token);

  const userEmail = user.email;
  const [update, setUpdate] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
    cpassword: "",
    changepassword: "",
    contactNumber: "",
    // imageName: "",
  });
  const [file, setImage] = useState(false);
  const imageHandle = (e) => {
    // setImage(e.target.files[0]);
    console.log(e.target.files);

    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
      return;
    }
    setUpdate({ ...update, imageName: e.target.files[0] });
    setImage(e.target.files[0]);
  };
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    async function loadData() {
      const response = await axios.get(
        `http://localhost:5000/auth/${user._id}`
      );
      const data = response.data;
      // console.log(response.data.lastname);
      if (response) {
        setUpdate({
          ...update,
          firstname: data.firstname,
          email: data.email,
          contactNumber: data.contactNumber,
          dob: data.dob ? data.dob.slice(0, data.dob.indexOf("T")) : "",
          imageName: data.imageName,
          lastname: data.lastname ? data.lastname : "",
        });
      }
    }
    loadData();
    // console.log(update.imageName);
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // setUpdate({})
    // console.log(preview);
    // console.log(update.imageName.length);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    // console.log(FileName);
    setUpdate({
      ...update,
      [name]: value,
    });
  };

  const saveProfile = async (e) => {
    console.log(update);
    let errors = {};
    if (!update.firstname.trim()) {
      errors.firstname = "Firstname required!";
    }
    if (user.lastname > 0) {
      if (!validateName.test(user.lastname)) {
        errors.lastname = "Last name must contain only 2 or more characters";
      }
    }

    if (!user.contactNumber) {
      errors.contactNumber = "contact number required!";
    } else if (!validateContact.test(user.contactNumber)) {
      errors.contactNumber = "contact number must be only 10 digits!";
    }

    if (!update.password) {
      errors.password = "Password Is Required!";
    } else if (!validatePassword.test(user.password)) {
      errors.password = "Password must conatin 6 characters with digits";
    } else if (update.changepassword !== update.cpassword) {
      errors.cpassword = "Password does not match";
    }
    // console.log(errors);
    // console.log(update);
    if (!false) {
      let formData = new FormData();
      const config = {
        header: {
          "content-type": "multipart/form-data",
          "x-auth-token": `${user.token}`,
        },
      };
      formData.append("image", file);
      formData.append("firstname", update.firstname);
      formData.append("lastname", update.lastname);
      formData.append("email", update.email);
      formData.append("dob", update.dob);
      // formData.append("imageName", update.imageName);
      formData.append("contactNumber", update.contactNumber);
      formData.append("password", update.password);
      formData.append("cpassword", update.cpassword);
      formData.append("changepassword", update.changepassword);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      await axios
        .post("http://localhost:5000/auth/user/updateProfile", formData, config)
        .then((res) => {
          const response = res.data.user;
          console.log(response);
          setUpdate({
            ...update,
            response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

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
        <div className="container rounded bg-white ">
          <div className="row">
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                {!update.imageName ? (
                  <Avatar
                    facebookId="100008343750912"
                    className="border-1 ms-1 mt-1 rounded-circle"
                    size="200"
                  />
                ) : (
                  <img
                    className="rounded-circle mt-5 border border-dark"
                    // src={`http://localhost:5000/${update.imageName}`}
                    src={
                      !preview
                        ? `http://localhost:5000/${update.imageName}`
                        : preview
                    }
                    alt="img"
                    width="100%"
                    height="200px"
                  />
                )}
                <span className="font-weight-bold">{update.firstname}</span>
                <span className="text-black-50">{update.email}</span>
                {/* <span>Update Photo</span> */}
                <div className="">
                  <input
                    onChange={imageHandle}
                    type="file"
                    name="file"
                    id=""
                    value={update.imgName}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-5 border-right">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Update Profile </h4>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="first name"
                      value={update.firstname}
                      name="firstname"
                      onChange={onChangeHandler}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="labels">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={update.lastname}
                      placeholder="last name"
                      name="lastname"
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="labels">PhoneNumber</label>
                    <input
                      type="text"
                      className="form-control"
                      value={update.contactNumber}
                      placeholder="Phone Number"
                      name="contactNumber"
                      onChange={onChangeHandler}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="labels">Date Of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Date of Birth"
                      value={update.dob}
                      name="dob"
                      onChange={onChangeHandler}
                    />
                  </div>
                </div>
                <div className="row ">
                  <div className="col-md-12">
                    <label className="labels">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={update.email}
                      name="email"
                      onChange={onChangeHandler}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <br />
              <div className="p-3 py-5 mt-4">
                <div className="col-md-12 mt-3 mb-3">
                  <label className="labels">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter old Password"
                    value={update.password}
                    name="password"
                    onChange={onChangeHandler}
                  />
                </div>
                <div className="col-md-12 mt-3 mb-3">
                  <label className="labels">Change Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new Password"
                    value={update.changepassword}
                    onChange={onChangeHandler}
                    name="changepassword"
                  />
                </div>
                <div className="col-md-12 mt-3 mb-3">
                  <label className="labels">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm changed Password"
                    value={update.cpassword}
                    onChange={onChangeHandler}
                    name="cpassword"
                  />
                </div>
                <br />
                <div className="mt-1 text-center">
                  <button
                    onClick={saveProfile}
                    className="btn btn-dark profile-button"
                    type="button"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
