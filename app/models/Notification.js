const mongoose = require('mongoose')
const { Schema } = mongoose


const Notification = new Schema({
    title: String,
    description: String,
    // content: String,
    // sender: mongoose.Types.ObjectId,
    receiver: mongoose.Types.ObjectId,
    isread: Number,
}, { timestamps: true });

module.exports = mongoose.model('Notification', Notification);