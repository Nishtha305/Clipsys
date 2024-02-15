const mongoose = require('mongoose')

const watchlaterModel = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies'
    }

})
module.exports = mongoose.model('watchlaters', watchlaterModel)