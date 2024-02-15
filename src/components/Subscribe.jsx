import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";
import StripeCheckout from "react-stripe-checkout";

const Subscribe = ({ setLoginUser }) => {
  const history = useNavigate();
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  // console.log("id:", userDetail._id);

  const [packages, setPackage] = useState([]);
  useEffect(() => {
    let datas = true;
    axios.get("http://localhost:5000/package/").then((res) => {
      if (datas) {
        setPackage(res.data);
      }
    });
    return () => {
      datas = false;
    };
  }, []);
  const makePayment = (token) => {
    const body = {
      packages,
      token,
      id: userDetail._id,
    };
    console.log(body);
    const header = {
      "Content-Type": "application/json",
    };
    return axios
      .post(`http://localhost:5000/payment/Payment`, body, header)
      .then((res) => {
        console.log("res :", res);
        userDetail["userType"] = "premiumUser";
        localStorage.setItem("userDetail", JSON.stringify(userDetail));
        alert(res.data);
        history("/");
      })
      .catch((err) => {
        console.log("err :", err);
      });
  };
  return (
    <div>
      <Header setLoginUser={setLoginUser} />
      {/* {console.log(packages)} */}
      <div
        style={{
          overflowY: "scroll",
          width: "98.4vw",
          height: "83.1vh",
          marginLeft: "48px",
          // border: "1px solid red",
        }}
      >
        <div className="row m-3 justify-content-center">
          <div className="col-4 mt-5">
            <div class="card col-lg-3 col-md-3 col-sm-3 col-xs-6" 
            style={{ width: "fit-content" }}>
              {/* <img src="..." class="card-img-top" alt="..." /> */}

              {packages.map((index) => {
                return (
                  <div className="card-body">
                    <h5 className="card-title">Premium Membership</h5>
                    <ul className="card-text list-group list-group-flush">
                      <li id={index._id} className="card-text list-group-item">
                        &#8377;{index.amount}/year
                      </li>
                      <li className="card-text list-group-item">
                        Create Channel
                      </li>
                      <li className="card-text list-group-item">
                        Watch Premium Contents
                      </li>
                    </ul>
                    <StripeCheckout
                      token={makePayment}
                      stripeKey="pk_test_51Klo14ECKnOUfeEF1KqdBIQTiwDT9NCtsEXeLGJ8FLxD0ejvlnlG7g0Az7xF0xEM4RzPbQTw79NH8ozeQkuu8hAQ0099tJWTVg"
                      name="Buy Premium Membership"
                      description="Premium MemberShip"
                      amount={
                        packages[0].amount
                          ? packages[0].amount * 100
                          : 499 * 100
                      }
                      currency="INR"
                    >
                      <button className="btn btn-primary">Pay Now</button>
                    </StripeCheckout>
                  </div>
                );
              })}
              {/* <li class="card-text list-group-item">
                  Login through 2 different devices
                </li> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
