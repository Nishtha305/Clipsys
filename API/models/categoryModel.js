const mongoose = require('mongoose')

const categoryModel = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos'
    },
    category: String

})

module.exports = mongoose.model('categories', categoryModel)