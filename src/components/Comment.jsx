import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import * as IoIcons from 'react-icons/io'

const Comment = ({ userId, videoId }) => {
  let [data, setData] = useState([]);
  const [comment, SetComment] = useState("")
  const handleChange = (event) => {
    SetComment(event.target.value);
  };

  const onComment = async () => {
    await axios
      .post("http://localhost:5000/comment/comment", {
        userId: userId,
        videoId: videoId,
        text: comment,
      })
      .then((res) => {
        // console.log(res.data.data);
        setData(res.data.data)
        // setComment([...getComment, res.data]);
      });
    SetComment("");
  };

  // let [userName, setUsername] = useState([]);
  useEffect(() => {
    let datas = true;
    axios
      .get(`http://localhost:5000/comment/getComment/${videoId}`)
      .then((res) => {
        if (datas) {
          // console.log(res.data);
          setData(res.data);
          // setUsername(res.data.userId.firstname);
        }
      });

    return () => {
      datas = false;
    };
  }, []);
  return (
    <>
      <div>
        <input
          className="comment-btn "
          placeholder="Add a Comment..."
          value={comment}
          onChange={handleChange}
        />
      </div>
      <div className="d-flex justify-content-end">
        <button
          type="reset"
          className="btn btn-dark m-1"
          onClick={() => {
            SetComment("");
            // console.log(value);
          }}
        >
          Cancel
        </button>

        <button
          className="btn btn-dark m-1"
          disabled={!comment}
          onClick={onComment}
        >
          Comment
        </button>
      </div>
      <hr />
      {data.map((index) => (
        <div className="d-flex rounded pt-1 pb-1">
          {
            !index.userId.imageName ?
              <Avatar
                facebookId="100008343750912"
                className="border-1 ms-1 mt-1 rounded-circle"
                size="50" /> :
              <img
                className="border-1 ms-1 mt-1 rounded-circle"
                src={`http://localhost:5000/${index.userId.imageName}`}
                alt=""
                width={50}
                height={50}
              />}
          <div className=" ms-1 p-1 pb-0" style={{ textAlign: "start" }}>
            <p className="h6">{index.userId.firstname}</p>
            <p>{index.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Comment;
