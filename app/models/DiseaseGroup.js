const mongoose = require('mongoose')
const { Schema } = mongoose

const DiseaseGroup = new Schema({
    title: String,
    slug: String,
    description: String,
    createBy: mongoose.Types.ObjectId,

}, { timestamps: true })

module.exports = mongoose.model('DiseaseGroup', DiseaseGroup)