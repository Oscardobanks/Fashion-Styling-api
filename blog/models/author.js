const mongoose = require('mongoose')

const Stylist = mongoose.model('Stylist', {
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    bodyweight: {
        type: Number
    },
    height: {
        type: Number
    }
});

module.exports = Stylist