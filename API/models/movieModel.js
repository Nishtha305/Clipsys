const mongoose = require('mongoose')

const movieModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    // premiumId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'premiums'
    // },
    commentId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
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
    like: {
        type: Number
    },
    uploadedAt: {
        type: Date
    }
})
module.exports = mongoose.model('movies', movieModel)
