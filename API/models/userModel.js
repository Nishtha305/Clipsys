const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId
    // },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
    },
    contactNumber: {
        type: String,
        require: true
    },
    dob: {
        type: Date,
        // require: false
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    changedPassword: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    imageName: {
        type: String,
        data: Buffer,
        default: ''
        // require: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'videos',
        // require: true
    }],
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        // require: true
    }],
    userType: {
        type: String,
        default: "user"
    },
    channelName: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channels',
    }],
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'playlists',
    }],
    createdAt: {
        type: Date,
        // default: Date.now()
    },
    updatedAt: {
        type: Date,
        // default: Date.now()
    }
});

module.exports = mongoose.model('users', userModel);