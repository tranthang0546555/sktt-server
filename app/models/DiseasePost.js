const mongoose = require('mongoose')
const { Schema } = mongoose
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const DiseasePost = new Schema({
    title: String,
    slug: { type: String, slug: "title", unique: true },
    description: String,
    modeContent: Number,
    content: {
        description: String,
        causes: String,
        symptoms: String,
        subject: String,
        prevention: String,
        // diagnosis: String,
        treatments: String,
        editor: String,
    },
    createdBy: mongoose.Types.ObjectId,
    groupBy: mongoose.Types.ObjectId,
    viewCount: Number,
    likeList: Array,

}, { timestamps: true })

module.exports = mongoose.model('DiseasePost', DiseasePost)