const mongoose = require('mongoose')

const reportmodel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'videos'
    },
    reportedAt: {
        type: Date
    }
})
module.exports = mongoose.model('reports', reportmodel)
