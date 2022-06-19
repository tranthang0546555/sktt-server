const DiseasePost = require('../models/DiseasePost')
const DiseaseGroup = require('../models/DiseaseGroup')
const date = require('date-and-time')
const User = require('../models/User')
const ObjectId = require('mongodb').ObjectId

class CRUDController {

    async index(req, res, next) {
        res.json(
            {
                abc: 'ad'
            }
        )
    }

    async createDiseasePost(req, res, next) {
        const disease = req.body
        await DiseasePost.create(disease)
        res.send({ message: 'Bài viết đã được tạo' })
    }

    async editDiseasePost(req, res, next) {
        const disease = req.body
        console.log(disease)
        await DiseasePost.findOneAndUpdate({ _id: ObjectId(disease._id) }, disease)
        res.send({ message: 'Bài viết đã chỉnh sửa' })
    }

    async addTimeServing(req, res) {

        const day = req.body.day
        const from = req.body.from
        const to = req.body.to
        // const from = date.format(new Date(req.body.from), 'hh:mm A');
        // const to = date.format(new Date(req.body.to), 'hh:mm A');

        const user = await User.findById({ _id: ObjectId(req.user._id) })

        if (day === 'mon') {
            const timeServing = user.description.timeserving.mon || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.mon': newTimeServing })
        }
        else if (day === 'tue') {
            const timeServing = user.description.timeserving.tue || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.tue': newTimeServing })
        }
        else if (day === 'wed') {
            const timeServing = user.description.timeserving.wed || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.wed': newTimeServing })
        }
        else if (day === 'thu') {
            const timeServing = user.description.timeserving.thu || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.thu': newTimeServing })
        }
        else if (day === 'fri') {
            const timeServing = user.description.timeserving.fri || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.fri': newTimeServing })
        }
        else if (day === 'sat') {
            const timeServing = user.description.timeserving.sat || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.sat': newTimeServing })
        }
        else if (day === 'sun') {
            const timeServing = user.description.timeserving.sun || []
            const newTimeServing = [...timeServing, { from, to }]
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.sun': newTimeServing })
        }

        res.json({ message: 'Đã cập nhật' })
    }

    async getTimeServing(req, res) {
        const user = await User.findById({ _id: ObjectId(req.user._id) })
        const timeServing = user.description.timeserving || []
        res.json(timeServing)
    }

    async resetTimeServing(req, res) {
        const day = req.body.day
        console.log(day)
        if (day === 'mon') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.mon': [] })
        }
        else if (day === 'tue') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.tue': [] })
        }
        else if (day === 'wed') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.wed': [] })
        }
        else if (day === 'thu') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.thu': [] })
        }
        else if (day === 'fri') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.fri': [] })
        }
        else if (day === 'sat') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.sat': [] })
        }
        else if (day === 'sun') {
            await User.updateOne({ _id: ObjectId(req.user._id) }, { 'description.timeserving.sun': [] })
        }

        res.json({ message: 'Đã đặt lại' })
    }

    async getDiseasePosts(req, res) {
        const doctorId = req.user._id
        // const diseasePosts = await DiseasePost.find({ createdBy: ObjectId(doctorId) })
        const diseasePosts = await DiseasePost.aggregate([
            {
                $match: {
                    createdBy: ObjectId(doctorId)
                }
            },
            {
                $lookup: {
                    from: 'diseasegroups',
                    localField: 'groupBy',
                    foreignField: '_id',
                    as: 'groupBy'
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    description: 1,
                    groupBy: 1,
                    listLike: 1,
                    modeContent: 1,
                    slug: 1,
                    viewCount: 1,
                }
            }
        ])
        res.json(diseasePosts)
    }
}

module.exports = new CRUDController