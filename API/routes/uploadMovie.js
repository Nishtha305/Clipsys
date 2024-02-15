const router = require('express').Router();
const fs = require('fs')
// const checkAuth = require('../middleware/check.auth')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const users = require('../models/userModel')
const movies = require('../models/movieModel')
const { moviefileStorageEngine, movieupload } = require('../middleware/multer');
const { convert360, convert480, convert720, convertm3u8, videoThumbnail } = require('../middleware/ffmpegMovie')

router.post('/upload', movieupload.single("video"), async (req, res) => {
    const { email, title, description, category } = req.body;
    // console.log(title);

    // console.log(req.file);
    const tempFileName = req.file.filename
    const mainFileName = tempFileName.slice(0, tempFileName.lastIndexOf('.'));
    var dir = `./uploads/movies/${mainFileName}`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // console.log(`videoFileName : ../uploads/movies/${mainFileName}/${mainFileName}.m3u8`);
    // console.log(`VideoFolderName : ../uploads/trash/${tempFileName}`);
    try { videoThumbnail(tempFileName, mainFileName) } catch (err) {
        // console.log(err);
    }
    convertm3u8(tempFileName, mainFileName)
    // convert720(tempFileName, mainFileName)
    // convert480(tempFileName, mainFileName)
    convert360(tempFileName, mainFileName)

    await users.findOne({ email: email }).then(function (data) {
        if (data) {
            // console.log(data);
            const movie = new movies({
                userId: data._id,
                title: title,
                description: description,
                url: mainFileName,
                category: category,
                uploadedAt: Date.now()
            })
            movie.save().then(function (result) {
                if (result) {
                    // console.log("hii");
                    users.findById({ _id: data._id }).then(data => {
                        // console.log(data)
                        if (data) {
                            data.movies.push(movie)
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

router.get('/getMovieById/:id', async function (req, res) {
    await movies.findById({ _id: req.params.id }).populate('userId', 'firstname email imageName').then(result => {
        if (result) {
            // console.log(result);
            return res.json(result)
        }
    })
})

router.delete('/delete/:id', async function (req, res) {
    await movies.findByIdAndDelete({ _id: req.params.id })
        .then(result => {
            users.updateOne({ "movies": req.params.id }, { $pull: { "movies": req.params.id } }).then(data => {
                if (data) {
                    movies.find({}).populate('userId', 'firstname email imageName').then(result => {
                        if (result) {
                            return res.json(result)
                        }
                    })
                }
            })
        })
})
router.get('/getAllMovies', function (req, res) {
    movies.find({}).populate('userId', 'firstname email imageName').then(result => {
        if (result) {
            return res.json(result)
        }
    })
})
module.exports = router
