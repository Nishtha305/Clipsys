import React from "react";
import { Link } from "react-router-dom";

const Category = ({ categoryName }) => {
  return (
    <>
      <div
        className="category"
        style={{ margin: "2px 10px", textTransform: "capitalize" }}
      >
        <Link
          className="text-white"
          to={categoryName === "Home" ? "/home" : `/category/${categoryName}`}
        >
          {categoryName}
        </Link>
      </div>
    </>
  );
};

export default Category;
