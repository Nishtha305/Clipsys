import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';
// import Header from './components/Header';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
// import VideoSingle from "./components/VideoSingle";
import Profile from "./components/Profile";
import UpdateRates from "./Admin/UpdateRates";
import UploadMovies from "./Admin/UploadMovies";
import Dashboard from "./Admin/Dashboard";
import VideoByCategory from "./components/VideoByCategory";
import Subscribe from "./components/Subscribe";
import ShowChannel from "./components/ShowChannel";
import Playlist from "./components/Playlist";
import WatchLater from "./components/WatchLater";
import VideosByPlaylist from "./components/VideosByPlaylist";
import ChannelSubscribe from "./components/ChannelSubscribe"
import Searchpage from "./components/Searchpage";
import SinglePage from "./components/SinglePage";
import PageNotFound from "./components/PageNotFound";
// import VideoPlayer from "./components/VideoPlayer";


function App() {
  const [user, setLoginUser] = useState();
  const [channel, setChannel] = useState(false);
  useEffect(() => {
    setLoginUser(JSON.parse(localStorage.getItem("userDetail")))
  }, [])
  return (
    <div className="App">
      <Router>
        {JSON.parse(localStorage.getItem("userDetail")) ?
          <Routes>
            {
              JSON.parse(localStorage.getItem("userDetail")).userType === "user" ?
                <Route path='/premium' exact
                  element={
                    <Subscribe setLoginUser={setLoginUser} />} />
                : <Route path='/premium' exact element={<PageNotFound />} />
            }
            {
              JSON.parse(localStorage.getItem("userDetail")).userType === 'premiumUser' ? < Route path='/ShowChannel' exact
                element={
                  <ShowChannel
                    setLoginUser={setLoginUser}
                    channel={channel}
                    setChannel={setChannel} />} />
                : <Route path='/ShowChannel' exact element={<PageNotFound />} />
            }
            {
              JSON.parse(localStorage.getItem("userDetail")).userType === 'admin' &&
              <Route exact path='/UpdateRates' element={<UpdateRates setLoginUser={setLoginUser} />} />}
            {
              JSON.parse(localStorage.getItem("userDetail")).userType === 'admin' &&
              <Route exact path='/UploadMovies' element={<UploadMovies setLoginUser={setLoginUser} />} />}
            {
              JSON.parse(localStorage.getItem("userDetail")).userType === 'admin' &&
              <Route path='/Dashboard' exact element={<Dashboard setLoginUser={setLoginUser} />} />
              //:
              // <>
              //   <Route path='/UpdateRates' exact element={<PageNotFound />} />
              //   <Route path='/UploadMovies' exact element={<PageNotFound />} />
              //   <Route path='/Dashboard' exact element={<PageNotFound />} />
              // </>
            }

            {/* Users Routes Starts From Here */}

            <Route path='/' exact element={
              <Home
                setLoginUser={setLoginUser}
                channel={channel}
                setChannel={setChannel} />}>
            </Route>
            <Route path='/signup' exact
              element={<PageNotFound />}>
            </Route>
            <Route path='/home' exact
              element={
                <Home
                  setLoginUser={setLoginUser}
                  channel={channel}
                  setChannel={setChannel} />}>
            </Route>
            <Route path='/single/:_id' exact
              element={<SinglePage
                setLoginUser={setLoginUser}
                channel={channel}
                setChannel={setChannel} />}>
            </Route>
            <Route path='/playlist/:_id' exact
              element={<VideosByPlaylist
                setLoginUser={setLoginUser}
                channel={channel}
                setChannel={setChannel} />}>
            </Route>
            <Route path='/playlist' exact
              element={<Playlist
                setLoginUser={setLoginUser}
                channel={channel}
                setChannel={setChannel} />}>
            </Route>
            <Route path='/watchlater' exact
              element={<WatchLater
                setLoginUser={setLoginUser}
                channel={channel}
                setChannel={setChannel} />}>
            </Route>
            <Route path='/profile' exact
              element={<Profile
                setLoginUser={setLoginUser}
                channel={channel}
                setChannel={setChannel} />}>
            </Route>
            <Route path='/category/:c' exact
              element={
                <VideoByCategory
                  setLoginUser={setLoginUser}
                  channel={channel}
                  setChannel={setChannel} />}>
            </Route>
            <Route path='/premium' exact
              element={
                <Subscribe setLoginUser={setLoginUser} />}>
            </Route>
            <Route path='/ShowChannel' exact
              element={
                <ShowChannel
                  setLoginUser={setLoginUser}
                  channel={channel}
                  setChannel={setChannel} />}>
            </Route>
            <Route path="/ChannelSubscribe" exact
            element={
              <ChannelSubscribe 
              setLoginUser={setLoginUser}
              channel={channel}
              setChannel = {setChannel}/>
            }></Route>
            <Route path="/search/:title" exact element={
              <Searchpage setLoginUser={setLoginUser} />}></Route>
            <Route path='/*' exact element={<PageNotFound />} />
          </Routes>
          : <Routes>
            <Route path="/" exact element={<Login setLoginUser={setLoginUser} />} />
            <Route path='/signup' exact element={<Signup />} />
            <Route path='/*' exact element={<PageNotFound />} />
          </Routes>}
      </Router>
    </div >
  );
}
export default App;


// {/* <Route exact path='/single/:_id'
//             element={<VideoSingle setLoginUser={setLoginUser}
//               channel={channel} setChannel={setChannel} />}>
//           </Route> */}
