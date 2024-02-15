import React, { useEffect, useState } from "react";
import "./UpdateRates.css";
import AdminNav from "./AdminNav";
import axios from "axios";
// import Footer from '../pages/Footer';

const UpdateRates = ({setLoginUser}) => {
  let [oldRate, setOldRate] = useState(0);
  const [rate, setRate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/package").then((res) => {
      // alert(res.data[0].amount);
      // console.log(res.data[0].amount);
      setRate((rate) => res.data[0].amount);
      setOldRate((oldRate) => res.data[0].amount);
    });
  }, []);
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setRate(value);
  };
  const onClickHandle = () => {
    // alert(rate.rate);
    // alert(oldRate);
    try {
      axios
        .put("http://localhost:5000/package/updatePrice", {
          oldRate: oldRate,
          rate: rate,
        })
        .then((result) => {
          alert("Package Price Updated");
          setRate(result.data.amount);
        });
    } catch (error) {
      alert("Server Not Working");
    }
  };
  return (
    <>
      <AdminNav setLoginUser={setLoginUser}/>
      <div className="admin container-fluid">
        <div className="cover">
          <h1 className="text-dark"> Update Rates!</h1>
          <div className="flex-form">
            <input
              type="text"
              name="rate"
              value={rate}
              onChange={onChangeHandle}
              placeholder="New Rate (Rs./month)"
            />
            <input type="submit" value="submit" onClick={onClickHandle} />
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default UpdateRates;
