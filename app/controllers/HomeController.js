const User = require('../models/User')
const ObjectId = require('mongodb').ObjectId
const Schedule = require('../models/Schedule')
const DiseasePost = require('../models/DiseasePost')
const Notification = require('../models/Notification')
const date = require('date-and-time')

class Home {

    index(req, res, next) {
        User.find({}).then(users => {
            res.json(users)
        }).catch(next)
    }

    async getDoctors(req, res) {
        const doctors = await User.aggregate([
            {
                $project: {
                    name: 1,
                    description: 1,
                    avatar: 1,
                    phone: 1,
                    birthday: 1,
                    level: 1,
                }
            },
            {
                $match: {
                    level: 2
                }
            }
        ])
        res.json({ doctors })
    }

    async getDoctor(req, res) {
        const id = req.params.id
        if (ObjectId.isValid(id)) {
            // const doctor = await User.findById({ _id: ObjectId(id) }).exec()

            const doctor = await User.aggregate([
                {
                    $match: { _id: ObjectId(id) }
                },
                { $unset: ['password', 'refreshToken', 'bookmark', 'createdAt'] }
            ])
            console.log(doctor)
            delete doctor.password
            return res.json(doctor[0])
        } else return res.status(404).send({ message: 'Không tìm thấy thông tin bác sĩ' })

    }

    async chooseTime(req, res) {
        const doctorId = req.query.doctorId
        const user = await User.findById({ _id: ObjectId(doctorId) })
        const timeServing = user.description.timeserving
        console.log(user)
        res.json(timeServing)
    }

    async scheduling(req, res) {
        const timeAt = req.body.timeAt
        const doctorId = req.body.doctorId
        const userId = req.user._id
        const valid = await Schedule.findOne({ doctorId: ObjectId(doctorId), 'timeAt.from': timeAt.from, 'timeAt.to': timeAt.to })

        if (valid) return res.send({ message: 'Thời gian bạn chọn đã được ai đó đặt trước, vui lòng chọn lúc khác' })

        const codeRoom = Math.round(Math.random() * 10000000000)

        await Schedule.create({
            title: 'Lịch khám bệnh',
            description: '',
            userId: ObjectId(userId),
            doctorId: ObjectId(doctorId),
            timeAt: timeAt,
            codeRoom,
            status: 0,
        })

        const from = date.format(new Date(timeAt.from), 'hh:mm A - DD/MM')
        // const to = date.format(new Date(timeAt.to), 'hh:mm A - DD/MM')

        await Notification.create({
            title: 'Đặt lịch khám thành công',
            description: `Lịch khám với Bác sĩ lúc ${from}, tại phòng cuộc gọi: ${codeRoom}`,
            // content: String,
            // sender: mongoose.Types.ObjectId,
            receiver: ObjectId(userId),
            isread: 1,
        })

        await Notification.create({
            title: 'Lịch khám bệnh mới',
            description: `Lịch khám với bệnh nhân lúc ${from}, tại phòng cuộc gọi: ${codeRoom}`,
            // content: String,
            // sender: mongoose.Types.ObjectId,
            receiver: ObjectId(doctorId),
            isread: 1,
        })

        res.json({ message: 'Đã đặt lịch khám thành công' })
    }


    async search(req, res) {
        const input = req.query.input
        // console.log(req)
        const diseasePosts = await DiseasePost.find({ title: { $regex: input, $options: "i" } })
        // const doctors = await User.find({ $or: [{ 'name.firstName': { $regex: input, $options: "i" } }, { 'name.lastName': { $regex: input, $options: "i" } }] }, { $unset: { password: 1 } })

        const doctors = await User.aggregate([
            {
                $match: {
                    $or: [
                        { 'name.firstName': { $regex: input, $options: "i" } },
                        { 'name.lastName': { $regex: input, $options: "i" } }
                    ],

                    'level': 2
                }
            },
            {
                $unset: ['password', 'refreshToken', 'bookmark']
            }
        ])

        const data = {
            diseasePosts,
            doctors,
        }
        res.send(data)
    }


    async getIntro(req, res) {
        const postNum = await DiseasePost.find({}).count()
        const userNum = await User.find({ level: 1 }).count()
        const doctorNum = await User.find({ level: 2 }).count()
        res.json({ postNum, userNum, doctorNum })
    }

    async getUI(req, res) {
        const banner = [
            'https://www.umhs-sk.org/hubfs/Infectious%20disease%20doctor.jpeg',
            'https://empireweekly.com/wp-content/uploads/2022/04/download.jpeg',
            'https://www.verywellmind.com/thmb/33e7FO-jy7abF2uIgqsfkiia7J8=/2780x1564/smart/filters:no_upscale()/mental-health-tracker-banner-03-db4c074daa7f4b719dfec6b4b4279c2d.png',
        ]

        const define = {
            title: 'Sức khoẻ tâm thần là gì?',
            content: 'Là một trạng thái của sự khỏe mạnh và hạnh phúc, nhận thức rõ được khả năng của mình, có thể đối phó với những căng thẳng bình thường trong cuộc sống, làm việc hiệu quả và có khả năng đóng góp cho cộng đồng',
            other: 'SKTT là hệ thống hỗ trợ chăm sóc sức khoẻ tâm thần (tâm lý), giúp người gặp phải các chứng bệnh tâm lý tìm lại được sự cân bằng cho bản thân và niềm vui trong cuộc sống.',
        }

        const count = {
            postNum: await DiseasePost.find({}).count(),
            userNum: await User.find({ level: 1 }).count(),
            doctorNum: await User.find({ level: 2 }).count(),
        }

        const slogan1 = {
            title: 'Tại sao sức khoẻ tâm thần quan trọng?',
            content: 'Có một sức khỏe tâm thần đồng nghĩa với việc không bị mắc các bệnh về tâm lý, rối loạn tâm thần, và đặc biệt là có một trạng thái thoải mái, tự tin vào bản thân, tự chủ trong hành động, có khả năng nhận biết năng lực của mình để có sự phát triển tốt nhất tạo sự cân bằng giữa các hoạt động sống',
            bg: 'http://localhost:5000/images/Brain-Health.jpg'
        }
        const slogan2 = {
            title: 'Hoạt động phi lợi nhuận',
            content: 'Đây là hệ thống đầu tiên trên cả nước đầu tư sức khoẻ y tế theo phương thức phi lợi nhuận. Sau một thời hoạt động, hệ thống đặt mục tiêu có chất lượng cao, miễn phí hợp lý để người dân có thể tới khám chữa bệnh tiện lợi',
            bg: 'https://live.staticflickr.com/4245/35423497105_c40c835482_b.jpg'
        }

        const doctorSlider = []

        res.json({ banner, define, count, slogan1, slogan2, doctorSlider })
    }

}

module.exports = new Home