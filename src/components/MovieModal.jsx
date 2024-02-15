import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";
import StripeCheckout from "react-stripe-checkout";
import { Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

const MovieModal = ({
    getMovieModal,
    setMovieModal,
    movieId,
    userId,
  }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userDetail"));

    return (
      <>
        <Modal show={getMovieModal} onHide={() => {setMovieModal(false)
        navigate('/')
        }}>
          <Modal.Header closeButton>
            <Modal.Title style={{marginRight: "50px", marginLeft:"100px"}}>Premium Membership</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid" 
            style={{
                  height: "150px",
                  width: " 250px",
                  marginRight: "130px",
                  marginLeft: "100px",
                  alignContent: "center",
                  textAlign: "center"
                  
                }} >
              <form
                method="post"
              >

               <ul className="card-text list-group list-group-flush" style={{ textAlign: "center" }}>
                     
                <li className="card-text list-group-item" style={{ textAlign: "center" }}> 
                    Create Channel
                </li>
                <li className="card-text list-group-item" style={{ textAlign: "center" }}>
                   Upload Videos
                </li>
                <li className="card-text list-group-item" style={{ textAlign: "center" }}>
                    Watch Movies
                </li>

                <li>
                  <Link
                    className="nav-link active"
                    style={{ fontSize: "1rem", textAlign: "center" }}
                    aria-current="page"
                    to="/premium"
                  >
                   Buy Premium Membership
                  </Link>
                </li>
              </ul> 

              </form>
            </div>
            <hr />

          </Modal.Body>
        </Modal>
      </>
    );
            
};      
  
  
export default MovieModal;
