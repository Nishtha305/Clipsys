const mongoose = require('mongoose')

const playlistModel = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    videoId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos'
    }],
    playlistName: {
        type: String,
        require: true,
        unique: true
    },
    createdAt: Date,
    updatedAt: Date
})

module.exports = mongoose.model('playlists', playlistModel)