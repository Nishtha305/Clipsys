const mongoose = require('mongoose')

const premiumModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'packages'
    },
    amount: {
        type: Number,
    },
    fromDate: {
        type: Date
    },
    toDate: {
        type: Date
    }
})

module.exports = mongoose.model('premiums', premiumModel)