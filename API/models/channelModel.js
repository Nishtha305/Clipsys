const mongoose = require('mongoose')

const channelModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    premiumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'premiums'
    },
    channelName: {
        type: String,
        require: true,
        unique: true
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscribers'
    }],
    channelDescription: {
        type: String,
    },
    createdAt: {
        type: Date
    },
})

module.exports = mongoose.model('channels', channelModel)