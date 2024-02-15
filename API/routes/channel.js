const router = require('express').Router();
// const checkAuth = require('../middleware/check.auth')
const users = require('../models/userModel')
// const mongoose = require('mongoose')
const channels = require('../models/channelModel')

router.post('/createChannel', (req, res) => {
    // console.log(req.body)
    // return res.json("hiiii")
    const { channelName, description, _id, userType } = req.body;
    channels.findOne({ channelName: channelName }).then(data => {
        if (data) {
            return res.status(400).json({ errors: "This ChannelName Alredy Exists" })
        } else {
            if (userType == "premiumUser" || userType == "admin") {
                const channel = new channels({
                    channelName: channelName,
                    channelDescription: description,
                    userId: _id,
                    createdAt: Date.now()
                })
                try {
                    channel.save().then(data => {
                        if (data) {
                            users.findById({ _id: _id }).then(data => {
                                data.channelName.push(channel)
                                data.save().then(data => {
                                    if (data) {
                                    }
                                })
                                return res.json(data)

                            })
                        }
                    })
                } catch (err) {
                    return res.json(err)
                }
            } else {
                return res.json({ err: "Sorry You are not a Premium User" })
            }
        }
    })
})

router.delete('/updateChannel/:channelId', (req, res) => {
    channels.findOneAndDelete({ _id: req.params.channelId }).then(data => {
        if (data) {
            users.updateOne({ channelName: req.params.channelId }, { $pull: { channelName: req.params.channelId } }).then(data => {
                if (data) {
                    return res.json(data)
                }
            })
        } else {
            return res.json({ err: "invalid Id" })
        }
    }).catch(err => {
        return res.json({ "61": err })
    })
})

// router.patch('/subscribe/:id', function (req, res) {
//     channels.findOne({ _id: req.params.id }).then()
// })

router.get('/getAllChannel', (req, res) => {
    channels.find({}).then(data => {
        if (data) {
            return res.json(data)
        }
    }).catch(err => {
        return res.json(err)
    })
})
router.get('/getChannelByName/:channelName', (req, res) => {
    channels.findOne({ channelName: req.params.channelName }).then(data => {
        if (data) {
            return res.json(data)
        }
    })
})


router.get('/getChannel/:userId', (req, res) => {
    channels.findOne({ userId: req.params.userId }).populate('userId', 'imageName').then(result => {
        if (result) {
            return res.json(result)
        }
    })
})

module.exports = router