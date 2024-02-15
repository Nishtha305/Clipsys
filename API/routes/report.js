const router = require('express').Router();
const videos = require('../models/videoModel')
const reports = require('../models/reportModel')

router.post('/report', async function (req, res) {
    const { videoId, userId } = req.body
    const report = new reports({
        videoId: videoId,
        userId: userId,
        reporttedAt: Date.now()
    })
    try {
        report.save()
            .then((data) => {
                videos.findOneAndUpdate({ _id: videoId }, { $push: { report: data._id } })
                    .then(result => {
                        return res.json({ "msg": "Report Successfull", result })
                    })
            })
    } catch (error) {
        return res.json({ "msg": "Failed to Report", error })
    }
})

router.delete('/delete/:id', function (req, res) {
    const { videoId, userId } = req.body
    reports.findByIdAndDelete({ _id: req.params.id, userId: userId }).then(result => {
        videos.findOneAndUpdate({ _id: videoId }, { $pull: { report: req.params.id } })
            .then(result => {
                return res.json({ "msg": "Report Successfull", result })
            })
    })
})

router.post('/reported/:userId', function (req, res) {
    const { videoId } = req.body;
    reports.find({ userId: req.params.userId, videoId: videoId }).count().then(data => {
        // console.log(data)
        if (data === 1) {
            return res.json({ "reported": true })
        } else {
            return res.json({ "reported": false })
        }

    })
})

router.get('/reportedVideos', function (req, res) {
    videos.find({}).sort({ report: -1 }).then(data => {
        return res.json(data)
    })
})

module.exports = router
