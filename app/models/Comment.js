const mongoose = require('mongoose')
const { Schema } = mongoose

const Comment = new Schema({
    postId: mongoose.Types.ObjectId,
    message: String,
    commentedBy: mongoose.Types.ObjectId,
    parentId: mongoose.Types.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model('Comment', Comment);