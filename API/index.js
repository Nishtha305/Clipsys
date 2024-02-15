require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const auth = require('./routes/auth')
const channel = require('./routes/channel')
const uploadVideo = require('./routes/uploadVideo')
const uploadMovie = require('./routes/uploadMovie')
const getProfileIamge = require('./routes/getProfileIamge')
const comment = require('./routes/comment')
const playlist = require('./routes/playlist')
const watchlater = require('./routes/watchlater')
const payment = require('./routes/payment')
const subscribe = require('./routes/subscribe')
const path = require('path')
const reporta = require('./routes/report')
const premiumMembership = require('./routes/premiumMembership');
// const { default: WatchLater } = require('../src/components/WatchLater');


//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('uploads'))

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//db connection
const dbUrl = 'mongodb://localhost:27017/vsdemo'
try {

    mongoose.connect(process.env.DBURL || dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('Database connected Successfully... ' + dbUrl);

} catch (err) {
    console.log({ message: 'Connection Failed..', err: err });
}

//server starting
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server Started at http://localhost:${port}/`);
})


app.use('/auth', auth)
app.use('/comment', comment)
app.use('/videos', uploadVideo)
app.use('/movies', uploadMovie)
app.use('/image', getProfileIamge)
app.use('/channel', channel)
app.use('/playlist', playlist)
app.use('/subscribe', subscribe)
app.use('/watchlater', watchlater)
app.use('/package', premiumMembership)
app.use('/payment', payment)
app.use('/report', reporta)