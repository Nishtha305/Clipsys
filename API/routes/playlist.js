
const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const users = require('../models/userModel')
const videos = require('../models/videoModel')
const comments = require('../models/commentModel')
const playlists = require('../models/playlistModel')
const checkAuth = require('../middleware/check.auth')

router.post('/createPlaylist', function (req, res) {
    const { userId, videoId, playlistName } = req.body;
    const playlist = new playlists({
        userId: userId,
        videoId: videoId,
        playlistName: playlistName,
        createdAt: Date.now()
    })
    try {
        playlist.save().then((result) => {
            return res.json({ "msg": "Playlist Created Successfully", result })
        }).catch((err) => {
            return res.json({ "21": err })
        });

    } catch (error) {
        return res.json({ "25": error })
    }
})

router.patch('/updateplaylist/:id', function (req, res) {
    // console.log(req.body);
    playlists.findOne({ videoId: req.body.videoId }).then(data => {
        if (data) {
            return res.json({ msg: "Video Already in Playlist..." })
        }
        playlists.findByIdAndUpdate({ _id: req.params.id },
            { $push: { videoId: req.body.videoId } })
            .then(result => {
                if (result) {
                    // console.log(result);
                    return res.json({ msg: "Video Added Successfully", result })
                }
            })
    })
})

router.patch('/deletefromplaylist/:id', function (req, res) {
    playlists.findByIdAndUpdate({ _id: req.params.id },
        { $pull: { videoId: req.body.videoId } })
        .then(result => {
            if (result) {
                playlists.findOne({ _id: req.params.id }).populate('videoId', 'title description url').then(data => {
                    if (data) {
                        return res.json(data)
                    }
                })
            }
        })
})

router.get('/getallplaylist', function (req, res) {
    playlists.find({}).populate("videoId", "title description url")
        .populate("userId", "firstName email").then(result => {
            return res.json(result)
        }).catch(err => {
            return res.json({ "42": err })
        })
})

router.get('/getplaylistId/:playlistId', function (req, res) {
    playlists.findOne({ _id: req.params.playlistId }).populate('videoId', 'title description url').then(data => {
        if (data) {
            // console.log(data);
            return res.json(data)
        }
    })
})

//get all playlist by user from playlist collection
router.get('/getplaylistbyId/:id', function (req, res) {
    playlists.find({ userId: req.params.id })
        .then(result => {
            if (result) {
                return res.json(result)
            }
        })
})

router.delete('/deletePlaylist/:playlistId', function (req, res) {
    playlists.findByIdAndDelete({ _id: req.params.playlistId }).populate('videoId', "title description url")
        .then(result => {
            if (result) {
                // return res.json(result)
                playlists.find({ userId: req.body.userId }).populate('videoId', "title description url")
                    .then(data => {
                        if (data) {
                            return res.json(data)
                        }
                    })
            }
        }).catch(err => {
            if (err) {
                return res.json({ "67 err": err })
            }
        })
})

//check the video is added or not in playlist
router.get('/palylisthasornot/:videoId', (req, res) => {
    playlists.find({ videoId: req.params.videoId }).then(result => {
        if (result) {
            return res.json(result)
        }
    })
})

module.exports = router
