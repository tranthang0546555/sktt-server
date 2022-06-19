const mongoose = require('mongoose')
const { Schema } = mongoose


const Schedule = new Schema({
    title: String,
    description: String,
    userId: mongoose.Types.ObjectId,
    doctorId: mongoose.Types.ObjectId,
    timeAt: {
        from: Date,
        to: Date,
    },
    codeRoom: Number,
    status: Number,
}, { timestamps: true });

module.exports = mongoose.model('Schedule', Schedule);