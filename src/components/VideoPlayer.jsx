import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import "../css/videoPlayer.css";

const VideoPlayer = ({ url, movieUrl }) => {
  const movie720 = `http://localhost:5000/movies/${url}/720/${url}.m3u8`;
  const movie480 = `http://localhost:5000/movies/${url}/480/${url}.m3u8`;
  const movie360 = `http://localhost:5000/movies/${url}/360/${url}.m3u8`;
  // console.log("url:", url);
  const [videoSrc, setVideoSrc] = useState(false);
  const video_player = useRef(false);
  const mainVideo = useRef(false);
  const progressArea = useRef(false);
  const progress_Bar = useRef(false);
  const fast_rewind = useRef(false);
  const play_pause = useRef(false);
  const fast_forward = useRef(false);
  const volume = useRef(false);
  const volume_range = useRef(false);
  const currentTime = useRef(false);
  const duration = useRef(false);
  const settingsBtn = useRef(false);
  const picture_in_picture = useRef(false);
  const fullscreen = useRef(false);
  const settings = useRef(false);
  const resolution = useRef(false);
  const playback = useRef(false);
  const playSpeed = useRef(false);
  const controls = useRef(false);

  function playVideo() {
    play_pause.current.innerHTML = "pause";
    play_pause.current.title = "pause";
    video_player.current.classList.add("paused");
    mainVideo.current.play();
  }
  function pauseVideo() {
    play_pause.current.innerHTML = "play_arrow";
    play_pause.current.title = "play";
    video_player.current.classList.remove("paused");
    mainVideo.current.pause();
  }
  // removeActiveClasses();
  function removeActiveClasses() {
    const speed = document.querySelectorAll(".speed");
    speed.forEach((event) => {
      event.classList.remove("active");
    });
  }
  //playBackSpeed
  function changePlaybackSpeed(e) {
    removeActiveClasses();
    e.target.classList.add("active");
    let speed = e.target.getAttribute("data-speed");
    mainVideo.current.playbackRate = speed;
  }
  //videoQuality
  function removeActiveQualities() {
    const quality = document.querySelectorAll(".quality");

    quality.forEach((event) => {
      event.classList.remove("active");
    });
  }
  //videoQualityChange
  function changeVideoQuality(e) {
    const qualityType = e.target.innerHTML.slice(
      0,
      e.target.innerHTML.indexOf("p")
    );
    switch (qualityType) {
      case "720":
        if (movieUrl) {
          setVideoSrc(movie720);
        }
        setVideoSrc(`http://localhost:5000/videos/${url}/720/${url}.m3u8`);
        break;
      case "480":
        if (movieUrl) {
          setVideoSrc(movie480);
        }
        setVideoSrc(`http://localhost:5000/videos/${url}/480/${url}.m3u8`);
        break;
      case "360":
        if (movieUrl) {
          setVideoSrc(movie360);
        }
        setVideoSrc(`http://localhost:5000/videos/${url}/360/${url}.m3u8`);
        break;
      default:
        if (movieUrl) {
          setVideoSrc(`http://localhost:5000/movies/${url}/${url}.m3u8`);
        }
        setVideoSrc(`http://localhost:5000/videos/${url}/${url}.m3u8`);
        break;
    }
    setTimeout(() => {
      playVideo();
    }, 500);
    // console.log(qualityType, typeof qualityType);
    removeActiveQualities();
    e.target.classList.add("active");
  }

  //below code to stream content in hls formate..
  useEffect(() => {
    if (url) {
      if (Hls.isSupported() && mainVideo.current) {
        // var video = document.getElementById("video");
        let hls = new Hls();
        // console.log("movieUrl :", videoSrc, url);
        if (movieUrl) {
          hls.loadSource(
            "http://localhost:5000/movies/" + url + "/" + url + ".m3u8"
          );
        } else {
          if (videoSrc) {
            hls.loadSource(videoSrc);
          } else {
            hls.loadSource(`http://localhost:5000/videos/${url}/${url}.m3u8`);
          }
        }
        hls.attachMedia(mainVideo.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          // mainVideo.current.play();
          playVideo();
        });
      } else {
        console.log("some error occured");
      }
    }
  }, [videoSrc, url]);

  return (
    <section className="player" style={{ height: "540px" }}>
      <div className=" container">
        <div
          className="max-w-full md:h-1/6"
          id="video_player"
          ref={video_player}
          onMouseOver={() => {
            controls.current.classList.add("active");
            console.log("mouseOver");
          }}
          onMouseOut={(e) => {
            if (video_player.current.classList.contains("paused")) {
              if (settingsBtn.current.classList.contains("active")) {
                controls.current.classList.add("active");
              } else {
                controls.current.classList.remove("active");
              }
            } else {
              controls.current.classList.add("active");
            }
          }}
        >
          <video
            id="main_video"
            poster={url ? `http://localhost:5000/videos/${url}/${url}.png` : ""}
            ref={mainVideo}
            onClick={(e) => {
              // console.log("video playing :", e.target.paused);
              e.target.paused ? playVideo() : pauseVideo();
            }}
            onLoadedData={(e) => {
              const videoDuration = e.target.duration;
              let totalMin = Math.floor(videoDuration / 60);
              let totalSec = Math.floor(videoDuration % 60);
              totalSec < 10
                ? (totalSec = `0${totalSec}`)
                : (totalSec = totalSec);
              duration.current.innerHTML = `${totalMin} : ${totalSec}`;
              // console.log(videoDuration, totalMin, totalSec);
            }}
            onTimeUpdate={(e) => {
              const currentVideoTime = e.target.currentTime;
              const videoDuration = e.target.duration;
              let currentMin = Math.floor(currentVideoTime / 60);
              let currentSec = Math.floor(currentVideoTime % 60);
              currentSec < 10
                ? (currentSec = `0${currentSec}`)
                : (currentSec = currentSec);
              currentTime.current.innerHTML = `${currentMin} : ${currentSec}`;
              let progressWidth = (currentVideoTime / videoDuration) * 100;
              progress_Bar.current.style.width = `${progressWidth}%`;
              // console.log(currentVideoTime, currentMin, currentSec);
            }}
            onEnded={(e) => {
              play_pause.current.innerHTML = "replay";
              play_pause.current.title = "Replay";
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          ></video>
          <div className="controls" ref={controls}>
            <div
              className="progress_area"
              ref={progressArea}
              onClick={(e) => {
                let videoDuration = mainVideo.current.duration;
                let progressWidthval = e.target.clientWidth;
                let ClickOffsetX = e.nativeEvent.offsetX;
                console.log(videoDuration, progressWidthval, ClickOffsetX);
                mainVideo.current.currentTime =
                  (ClickOffsetX / progressWidthval) * videoDuration;
              }}
            >
              <div className="progress_bar" ref={progress_Bar}></div>
              <span></span>
            </div>
            <div className="controls_list">
              <div className="controls_left">
                <span className="icons">
                  <i
                    className="material-icons fast_rewind"
                    ref={fast_rewind}
                    onClick={() => {
                      mainVideo.current.currentTime -= 10;
                    }}
                  >
                    replay_10
                  </i>
                </span>
                <span className="icons">
                  <i
                    className="material-icons play"
                    ref={play_pause}
                    onClick={() => {
                      const isVideoPaused =
                        video_player.current.classList.contains("paused");
                      isVideoPaused ? pauseVideo() : playVideo();
                    }}
                  >
                    play_arrow
                  </i>
                </span>
                <span className="icons">
                  <i
                    className="material-icons fast_forward"
                    ref={fast_forward}
                    onClick={() => {
                      mainVideo.current.currentTime += 10;
                    }}
                  >
                    forward_10
                  </i>
                </span>
                <span className="icons">
                  <i
                    className="material-icons volume"
                    ref={volume}
                    onClick={(e) => {
                      if (volume_range.current.value == 0) {
                        volume_range.current.value = 80;
                        mainVideo.current.volume = 0.8;
                        e.target.innerHTML = "volume_up";
                      } else {
                        volume_range.current.value = 0;
                        mainVideo.current.volume = 0;
                        e.target.innerHTML = "volume_off";
                      }
                    }}
                  >
                    volume_up &nbsp;
                  </i>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="volumeRange"
                    className="volume_range"
                    ref={volume_range}
                    onChange={(e) => {
                      mainVideo.current.volume = e.target.value / 100;
                      if (e.target.value == 0) {
                        volume.current.innerHTML = "volume_off";
                      } else if (e.target.value <= 40) {
                        volume.current.innerHTML = "volume_down";
                      } else {
                        volume.current.innerHTML = "volume_up";
                      }
                    }}
                  />
                </span>
                <div className="timer">
                  <span className="current" ref={currentTime}>
                    0:00
                  </span>{" "}
                  /{" "}
                  <span className="duration" ref={duration}>
                    0:00
                  </span>
                </div>
              </div>
              <div className="controls_right">
                <span className="icons">
                  <i
                    className="material-icons settingsBtn"
                    ref={settingsBtn}
                    onClick={(e) => {
                      settings.current.classList.toggle("active");
                      e.target.classList.toggle("active");
                    }}
                  >
                    settings
                  </i>
                </span>
                <span className="icons">
                  <i
                    className="material-icons hd"
                    // ref={resolution}
                    onClick={(e) => {
                      resolution.current.classList.toggle("active");
                      e.target.classList.toggle("active");
                    }}
                  >
                    hd
                  </i>
                </span>
                <span className="icons">
                  <i
                    className="material-icons picture_in_picture"
                    ref={picture_in_picture}
                    onClick={(e) => {
                      mainVideo.current.requestPictureInPicture();
                    }}
                  >
                    picture_in_picture_alt
                  </i>
                </span>
                <span className="icons">
                  <i
                    className="material-icons fullscreen"
                    ref={fullscreen}
                    onClick={(e) => {
                      if (
                        !video_player.current.classList.contains(
                          "openFullScreen"
                        )
                      ) {
                        video_player.current.classList.add("openFullScreen");
                        e.target.innerHTML = "fullscreen_exit";
                        video_player.current.requestFullscreen();
                      } else {
                        video_player.current.classList.remove("openFullScreen");
                        e.target.innerHTML = "fullscreen";
                        document.exitFullscreen();
                      }
                    }}
                  >
                    fullscreen
                  </i>
                </span>
                <div id="settings" ref={settings}>
                  <div className="playback" ref={playback}>
                    <span>Playback Speed</span>
                    <ul>
                      <li
                        className="speed"
                        data-speed="0.25"
                        ref={playSpeed}
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        0.25
                      </li>
                      <li
                        data-speed="0.50"
                        className="speed "
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        0.50
                      </li>
                      <li
                        data-speed="0.75"
                        className="speed"
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        0.75
                      </li>
                      <li
                        data-speed="1"
                        className="speed active"
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        Normal
                      </li>
                      <li
                        data-speed="1.25"
                        className="speed "
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        1.25
                      </li>
                      <li
                        data-speed="1.50"
                        className="speed"
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        1.50
                      </li>
                      <li
                        data-speed="1.75"
                        className="speed"
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        1.75
                      </li>
                      <li
                        data-speed="2"
                        className="speed"
                        onClick={(e) => {
                          changePlaybackSpeed(e);
                        }}
                      >
                        2
                      </li>
                    </ul>
                  </div>
                </div>
                <div id="resolution" ref={resolution}>
                  <span>Video Quality</span>
                  <ul>
                    <li
                      className="quality active"
                      onClick={(e) => {
                        changeVideoQuality(e);
                      }}
                    >
                      Auto
                    </li>
                    <li
                      className="quality"
                      onClick={(e) => {
                        changeVideoQuality(e);
                      }}
                    >
                      720p
                    </li>
                    <li
                      className="quality"
                      onClick={(e) => {
                        changeVideoQuality(e);
                      }}
                    >
                      480p
                    </li>
                    <li
                      className="quality"
                      onClick={(e) => {
                        changeVideoQuality(e);
                      }}
                    >
                      360p
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
