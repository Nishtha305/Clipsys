const router = require('express').Router()
const videos = require('../models/videoModel')
const subscribers = require('../models/subscriberModel')
const channels = require('../models/channelModel')
const users = require('../models/userModel')

router.post('/channel', function (req, res) {
    const { userId, channelId } = req.body;
        const subscribe = new subscribers({
        userId: userId,
        channelId: channelId,
        createdAt: Date.now()
    })
    try {
        subscribe.save().then((result) => {
            const subscriberId = result._id
            // console.log(result._id)
            channels.findByIdAndUpdate({ _id: channelId },
                { $push: { subscribers: subscriberId } })
                .then(result => {
                    return res.json({ "msg": "added to subscribed list", result })
                })
        })
            .catch((err) => {
                return res.json({ "30": err })
            });
    }
    catch (err) {
        return res.json({ '34': err })
    }
    // })
})

router.post('/checksubscriber', function (req, res) {
    const { userId, channelId } = req.body;
    console.log(req.body);
    subscribers.findOne({ userId: userId, channelId: channelId })
        .then((result) => {
            console.log(result);

            if (result) {
                return res.json(true)
            } 
            else {
                return res.json(false)
            }
        })
})


router.get('/getchannellistid/:videoId', function (req, res){
    videos.findById({_id: req.params.videoId})
    .populate("userId","firstName email")
    .then(result =>{
        const userId = result.userId._id   
        users.findById({_id: userId})
        .populate("channelName","channelName channelDescription")
        .then(result=>{
            return res.json(result.channelName[0])
        })
    })
})


router.delete('/unsubscribe/', function (req, res) {
    const { userId, channelId } = req.body;
    subscribers.findOne({ userId: userId, channelId: channelId }).then(result => {
            const subscriberId = result._id
            subscribers.deleteOne({ _id: subscriberId })
                .then(result => {
                    channels.findByIdAndUpdate({ _id: channelId },
                        { $pull: { subscribers: req.params.subscriberId } })
                        .then(result => {
                            subscribers.find({ userId: req.body.userId }).
                                populate('channelId', "channelName channelDescription")
                                .then(data => {
                                    if (data) {
                                        return res.json({ "msg": "removed from subscribed list", data })
                                    }
                                })
                        }).catch(err => {
                            if (err) {
                                return res.json({ "86 err": err })
                            }
                        })
                })
            // return res.json(result)
        })
})

router.delete('/delete/:id', function (req, res){
    subscribers.findByIdAndDelete({_id: req.params.id})
    .populate('channelId', 'channelName channelDescription')
    .then(result=>{
        if(result){
            subscribers.find({ userId: req.body.userId })
            .populate('channelId', "channelName channelDescription")
                .then(data => {
                    if (data) {
                        return res.json(data)
                    }
                })
        }
    }).catch(err => {
        if (err) {
            return res.json({ "107 err": err })
        }
    })
})

router.get('/getsubcribed/:userId',function (req, res){
    subscribers.find({userId: req.params.userId})
    .populate("channelId","channelName channelDescription")
    .then(result=>{
        return res.json(result)
    })
})

module.exports = router

