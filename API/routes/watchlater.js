const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const users = require('../models/userModel')
const videos = require('../models/videoModel')
const watchlaters = require('../models/watchlaterModel')
const comments = require('../models/commentModel')
const checkAuth = require('../middleware/check.auth')

router.post('/createwatchlater', function (req, res) {
    const { userId, videoId, movieId, playlistName } = req.body;
    const watchlater = new watchlaters({
        userId: userId,
        videoId: videoId,
        movieId: movieId,
        // playlistName: playlistName
    })
    try {
        watchlater.save().then((result) => {
            return res.json({ "msg": "Added to WatchLater", result })
        }).catch((err) => {
            return res.json({ "21": err })
        });

    } catch (error) {
        return res.json({ "25": error })
    }
})

router.patch('/updatewatchlater/:id', checkAuth, function (req, res) {
    watchlaters.findByIdAndDelete({ _id: req.params.id }).then(data => {
        if (data) {
            return res.json(data)
        }
    })
})

router.get('/getallwatchlater', function (req, res) {
    watchlaters.find({}).populate("videoId", "title description url").then(result => {
        if (result) {
            return res.json(result)
        }
    }).catch(err => {
        if (err) {
            return res.json({ "44 err": err })
        }
    })
})
router.get('/getallwatchlater/:id', function (req, res) {
    watchlaters.find({ _id: req.params.id }).populate("videoId", "title description url").then(result => {
        if (result) {
            return res.json(result)
        }
    }).catch(err => {
        if (err) {
            return res.json({ "44 err": err })
        }
    })
})

router.get('/get/watchlater/:id', function (req, res) {
    watchlaters.find({ userId: req.params.id }).populate("videoId", "title description url").then(result => {
        if (result) {
            return res.json(result)
        }
    }).catch(err => {
        if (err) {
            return res.json({ "44 err": err })
        }
    })
})

router.get('/get/watchlater/:id', function (req, res) {
    watchlaters.find({ userId: req.params.id }).populate("videoId", "title description url").then(result => {
        if (result) {
            return res.json(result)
        }
    }).catch(err => {
        if (err) {
            return res.json({ "44 err": err })
        }
    })
})

router.post('/getvideo/:id', function (req, res) {
    watchlaters.findOne({ videoId: req.params.id, userId: req.body.userId }).then(data => {
        if (data) {
            return res.json(data)
        }
    })
})

router.delete('/delete/:id', function (req, res) {
    watchlaters.findByIdAndDelete({ _id: req.params.id })
    .populate('videoId', "title description url")
        .then(result => {
            if (result) {
                // return res.json(result)
                watchlaters.find({ userId: req.body.userId })
                .populate('videoId', "title description url")
                    .then(data => {
                        if (data) {
                            return res.json(data)
                        }
                    })
            }
        }).catch(err => {
            if (err) {
                return res.json({ "108 err": err })
            }
        })
})

router.delete('/deleteVideo/:id', function (req, res) {
    watchlaters.findOne({ videoId: req.params.id }).then(result => {
        if (result) {
            watchlaters.deleteOne({ videoId: req.params.id })
                .then(doc => {
                    if (doc) {
                        return res.json(doc)
                    }
                })
        }
    }).catch(err => {
        if (err) {
            return res.json({ "57 err": err })
        }
    })
})

module.exports = router