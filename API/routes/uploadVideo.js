const router = require('express').Router();
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const checkAuth = require('../middleware/check.auth')
const users = require('../models/userModel')
const videos = require('../models/videoModel')
const watchlaters = require('../models/watchlaterModel')
const playlists = require('../models/playlistModel')
const { videofileStorageEngine, videoupload } = require('../middleware/multer');
const { convert360, convert480, convert720, convertm3u8, videoThumbnail } = require('../middleware/ffmpeg')

router.post('/upload', videoupload.single("video"), async (req, res) => {
    // console.log(req.file);
    const tempFileName = req.file.filename
    const mainFileName = tempFileName.slice(0, tempFileName.lastIndexOf('.'));
    var dir = `./uploads/videos/${mainFileName}`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // console.log(`videoFileName : ../uploads/videos/${mainFileName}/${mainFileName}.m3u8`);
    // console.log(`VideoFolderName : ../uploads/trash/${tempFileName}`);
    try { videoThumbnail(tempFileName, mainFileName) } catch (err) {
        // console.log(err);
    }
    convertm3u8(tempFileName, mainFileName)
    convert720(tempFileName, mainFileName)
    convert480(tempFileName, mainFileName)
    convert360(tempFileName, mainFileName)

    const { channelName, email, title, description, url, category } = req.body;
    await users.findOne({ email: email }).then(function (data) {
        if (data) {
            // console.log(data);
            const video = new videos({
                userId: data._id,
                title: title,
                description: description,
                url: mainFileName,
                category: category,
                uploadedAt: Date.now()
            })
            video.save().then(function (result) {
                if (result) {
                    // console.log("hii");
                    users.findById({ _id: data._id }).then(data => {
                        // console.log(data)
                        if (data) {
                            data.videos.push(video)
                            data.save().then((data) => {
                                return res.json({ "msg": "video uploaded successfully", data })
                            })
                        }
                    }).catch((err) => {
                        return res.json({ err, msg: "something is missing" })
                    })
                }
            })
        }
    })
})

router.put('/update/likes', (req, res) => {
    videos.findById({ _id: req.body._id }).then(result => {
        if (result) {
            // console.log(result);
            const videoLikes = parseInt(result.videoLikes)
            // console.log(videoLikes);
            const like = parseInt(req.body.likes)
            // console.log(like);
            videos.updateOne({ _id: result._id }, { $set: { "videoLikes": like } }).then((result) => {
                return res.json(result)
            })
        }
    })
})
router.get('/trending', (req, res) => {
    videos.find({}).sort({ 'videoLikes': -1 }).then(result => {
        if (result) {
            return res.json(result)
        }
    })
})

router.get('/category/:category', function (req, res) {
    // console.log(req.params);
    videos.find({ category: req.params.category }).then(result => {
        if (result) {
            return res.json(result)
        }
    }).catch(err => {
        return res.json(err)
    })

})

router.get('/desc/lastTen', (req, res) => {
    videos.find({}).populate('userId', 'firstname email imageName').sort({ x: -1 }).limit(10).then(result => {
        if (result) {
            return res.json(result)
        }
    })
})

router.get('/getVideoByUser/:userId', (req, res) => {
    videos.find({ userId: req.params.userId }).then(result => {
        if (result) {
            return res.json(result)
        }
    })
})

// router.delete('/upload/:id', function (req, res) {
router.delete('/delete/:id', function (req, res) {
    videos.findByIdAndDelete({ _id: req.params.id })
        .then(result => {
            watchlaters.find({ videoId: req.params.id }).then(data => {
                if (data) {
                    watchlaters.deleteOne({ videoId: req.params.id }).then(doc => { })
                }
            })
            playlists.find({ videoId: req.params.id }).then(data => {
                if (data) {
                    playlists.updateOne({ videoId: req.params.id }, { $pull: { videoId: req.body.videoId } }).then(doc => { })
                }
            })
            users.updateOne({ "videos": req.params.id }, { $pull: { "videos": req.params.id } }).then(data => {
                if (data) {
                    // return res.json(data)
                    videos.find({ userId: req.body.userId }).then((result) => {
                        if (result) {
                            return res.json(result)
                        }
                    })
                }
            })
        })
    // console.log('body',req.body);
})
router.delete('/admin/delete/:id', function (req, res) {
    videos.findByIdAndDelete({ _id: req.params.id })
        .then(result => {
            users.updateOne({ "videos": req.params.id }, { $pull: { "videos": req.params.id } }).then(data => {
                if (data) {
                    // return res.json(data)
                    videos.find({}).populate('userId', 'firstname lastname ').sort({ report: -1 }).then(data => {
                        if (data) {
                            return res.json(data)
                        }
                    })
                }
            })
        })
    // console.log('body',req.body);
})

router.get('/getVideoByUser/:userId', (req, res) => {
    videos.find({ userId: req.params.userId }).then(result => {
        if (result) {
            return res.json(result)
        }
    })
})
// model.findOne({name: new RegExp('^'+name+'$', "i")}, function(err, doc) {
//     Do your action here..
//   });
router.get('/search/:name', function (req, res) {
    videos.find({ title: { '$regex': req.params.name } })
        .then(result => {
            if (result) {
                return res.json(result)
            }
        })
})

router.patch('/report/:id', (req, res) => {
    videos.updateOne({ _id: req.params.id }, { $set: { report: req.body.report } })
        .then(result => {
            if (result) {
                return res.json({ "msg": "Reported Successfully", result })
            }
        }).catch(err => {
            return res.json({ "129 err": err })
        })
})

router.delete('/deleteAllByUser/:id', (req, res) => {
    videos.deleteMany({ userId: req.params.id }).then(result => {
        if (result) {

            return res.json(result)

        }
    })
})

router.get('/:videoId', (req, res) => {
    // console.log(req.params);
    videos.findById({ _id: req.params.videoId }).populate('userId', 'firstname email imageName').then((data) => {
        // console.log(data)
        return res.send(data)
    })
})
router.get('/', (req, res) => {
    videos.find({}).populate('userId', 'firstname email imageName').then((data) => {
        // console.log(data)
        return res.send(data)
    })
})

router.get('/get/reported/videos', function (req, res) {
    videos.find({}).populate('userId', 'firstname lastname ').sort({ report: -1 }).then(data => {
        if (data) {
            return res.json(data)
        }
    })
})

//find the number of videos uploaded by user
router.get('/countUploadedVideos/:id', function (req, res) {
    // users.aggregate([{
    //     "$project": {
    //         "videosCount": {
    //             "$size": { "$ifNull": ["$videos", []] }
    //         }
    //     }
    // }]).then(data => {
    //     return res.json(data)
    // })
    videos.find({ userId: req.params.id }).count().then(data => {
        return res.json(data)
    })
})
module.exports = router


  // ffmpeg(`./uploads/trash/${tempFileName}`)
    //     .addOption([
    //         '-start_number 0',
    //         '-hls_time 10',
    //         '-hls_list_size 0',
    //         '-f hls',
    //         '-s 1280x720'
    //     ])
    //     .output(`./uploads/videos/${mainFileName}/${mainFileName}.m3u8`)
    //     .on('start', function () {
    //         console.log('Conversion Started...');
    //     })
    //     .on('progress', function (progress) {
    //         console.log('in Progress:', progress);
    //     })
    //     .on('end', function (data) {
    //         console.log('File Converted...', data);
    //     }).on('error', function (err) {
    //         console.log('Something is Wrong:', err);
    //     }).run()