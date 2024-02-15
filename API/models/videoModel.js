const mongoose = require('mongoose')

const videoModel = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    commentId: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'comments'
    }],
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
    },
    videoLikes: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        require: true
    },
    report: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'reports'
    }],
    uploadedAt: {
        type: Date,
    }

})

module.exports = mongoose.model('videos', videoModel)