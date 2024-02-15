const router = require('express').Router()
// const { check, validationResult, Result } = require('express-validator')
// const users = require('../models/userModel')
const videos = require('../models/videoModel')
const comments = require('../models/commentModel')
// const checkAuth = require('../middleware/check.auth')
// const { default: mongoose } = require('mongoose')

router.post('/comment', function (req, res) {
    const comment = new comments({
        userId: req.body.userId,
        videoId: req.body.videoId,
        text: req.body.text,
        createdAt: Date.now()
    })

    try {
        comment.save().then(data => {
            videos.findById({ _id: req.body.videoId }).then(doc => {
                // console.log(doc);
                if (doc) {
                    doc.commentId.push(comment)
                    doc.save().then(result => {
                        comments.find({ videoId: req.body.videoId })
                            .populate("userId", "firstname email imageName").then(data => {
                                return res.json({ msg: "Successfull...", data })

                            }).catch(err => {
                                return res.json(err)
                            })
                    })
                }
            }).catch(err => {
                return res.json(err)
            })
        }).catch(errors => {
            return res.json(errors)
        })

    } catch (error) {
        return res.json(error)
    }
})

router.get('/getComment/:videoid', function (req, res) {
    comments.find({ videoId: req.params.videoid })
        .populate("userId", "firstname email imageName").then(data => {
            return res.json(data)
        }).catch(err => {
            return res.json(err)
        })
    // videos.findById({ _id: req.params.videoid }).populate('commentId', 'text createdAt').populate("userId", 'firstname email').then(data => {
    //     return res.json(data)
    // }).catch(err => {
    //     return res.json(err)
    // })
})

router.delete('/deleteComment/:id', function (req, res) {
    // console.log(req.body);
    comments.findByIdAndDelete({ _id: req.params.id }).then(Result => {
        videos.updateOne({ "commentId": req.params.id },
            { $pull: { "commentId": req.params.id } }).then(doc => {
                if (doc) {
                    comments.find({ videoId: req.body.videoId })
                        .populate("userId", "firstname email imageName").then(data => {
                            return res.json({ msg: "Successfull...", data })

                        }).catch(err => {
                            return res.json(err)
                        })
                    // return res.json()
                }
            })
    })
})

module.exports = router