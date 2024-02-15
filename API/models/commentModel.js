const mongoose = require('mongoose');

const commentModel = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos'
    },
    text: {
        type: String,
    },
    createdAt: {
        type: Date
    }


})

module.exports = mongoose.model('comments', commentModel)