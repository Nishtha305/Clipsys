import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Header from './Header'

const ChannelSubscribe = (setLoginUser, setChannel, channel) => {
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const [subscribe, setSubscribe] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/subscribe/getsubcribed/${user._id}`)
      .then(res => {
        if (res) {
          // console.log(res.data)
          setSubscribe(res.data)
        }
      })
  }, [])
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
          paddingLeft: "5px",
        }}
      >
        <div>
          {subscribe.map(channel => (
            <div className='d-flex list-group-item 
            bg-light border-white text-start'>
              <ul key={channel._id}>
                <li>{channel.channelId.channelName}</li>
                <li>{channel.channelId.channelDescription}</li>
              </ul>
              <button className='btn btn1 transparent' 
                style={{
                  display: 'flex',
                  marginLeft: "auto",
                  marginRight: "20px",
                }}
                onClick={() => {
                  axios
                    .delete(`http://localhost:5000/subscribe/delete/${channel._id}`,
                      { userId: user._id }
                    ).then((res) => {
                      if (res) {
                        // console.log(res.data);
                        setSubscribe(res.data);
                      }
                    });
                }}>Unsubscribe</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChannelSubscribe