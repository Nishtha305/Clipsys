const mongoose = require('mongoose');

const packageModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    amount: {
        type: Number,
    },
    validity: {
        type: String
    }
})

module.exports = mongoose.model('packages', packageModel)

