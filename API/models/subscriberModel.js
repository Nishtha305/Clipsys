const mongoose = require('mongoose')

const subscribermodel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'channels'
    },
    subscribedAt: {
        type: Date
    }
})
module.exports = mongoose.model('subscribers', subscribermodel)
