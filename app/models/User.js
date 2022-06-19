const mongoose = require('mongoose')
const { Schema } = mongoose
const timeZone = require('moment-timezone');
timeZone.tz(Date.now(), 'Asia/Ho_Chi_Minh');

const User = new Schema({
    name: {
        firstName: { type: String, maxlength: 20 },
        lastName: { type: String, maxlength: 20 }
    },
    email: String,
    password: String,

    phone: { type: Number, maxlength: 12 },

    avatar: String,
    birthday: Date,
    gender: Number,
    bookmark: { type: Array },
    voted: { type: Array },

    level: Number,
    refreshToken: String,
    accessToken: String,

    description: {
        degree: String,
        address: String,
        experience: String,
        timeserving: {
            mon: Array,
            tue: Array,
            wed: Array,
            thu: Array,
            fri: Array,
            sat: Array,
            sun: Array,
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', User);