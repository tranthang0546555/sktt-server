const Schedule = require('../models/Schedule')
const Notification = require('../models/Notification')
const User = require('../models/User')
const ObjectId = require('mongodb').ObjectId
class UserController {
    getInfor(req, res) {
        res.send(req.user)
    }


    async changeAvatar(req, res) {
        const fileName = req.file?.filename

        const userId = req.user._id
        await User.updateOne({ _id: ObjectId(userId) }, { avatar: fileName })

        res.send({ message: 'Đã cập nhật ảnh đại diện' })
    }

    async updateProfile(req, res) {
        const user = req.body
        await User.updateOne({ _id: ObjectId(req.user._id) }, {
            name: { firstName: user.firstName, lastName: user.lastName },
            phone: user.phone,
            description: {
                degree: user.degree,
                address: user.address,
                experience: user.experience,
            },
            birthday: user.birthday,
            gender: user.gender,
        })
        res.send({ message: 'Đã cập nhật thông tin' })
    }

    async getScheduleUser(req, res) {
        // const schedule = await Schedule.find({ userId: ObjectId(req.user._id) })

        const schedule = await Schedule.aggregate([
            {
                $match: { userId: ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                description: 1,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    userId: 1,
                    doctorId: 1,
                    timeAt: 1,
                    codeRoom: 1,
                    status: 1,
                    createdAt: 1,
                    "doctor": { "$arrayElemAt": ["$doctor", 0] }
                }
            },
        ])
        res.send(schedule)
    }


    async getScheduleDoctor(req, res) {
        // const schedule = await Schedule.find({ userId: ObjectId(req.user._id) })

        const schedule = await Schedule.aggregate([
            {
                $match: { doctorId: ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                email: 1,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    userId: 1,
                    doctorId: 1,
                    timeAt: 1,
                    codeRoom: 1,
                    status: 1,
                    createdAt: 1,
                    "user": { "$arrayElemAt": ["$user", 0] }
                }
            },
        ])
        res.send(schedule)
    }

    async joinRoom(req, res) {
        try {
            const codeRoom = req.params.codeRoom
            const schedule = await Schedule.findOne({ codeRoom })
            const hasAccess = (schedule?.userId.toString() === req.user._id) || (schedule?.doctorId.toString() === req.user._id)
            res.json({ hasAccess })
        } catch (error) {
            res.status(404).send({ message: 'Không tìm thấy phòng này' })
        }
    }


    async getNotification(req, res) {
        const userId = req.user._id
        const schedule = await Notification.find({ receiver: ObjectId(userId) })
        res.json(schedule)
    }

    async readNotification(req, res) {
        // console.log(req)
        const notiId = req.body.notiId
        await Notification.updateOne({ _id: ObjectId(notiId) }, { isread: 0 })
        res.json({ message: 'Đã đọc thông báo' })
    }

}

module.exports = new UserController