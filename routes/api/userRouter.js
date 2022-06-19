const HomeController = require('../../app/controllers/HomeController')
const UserController = require('../../app/controllers/UserController')
const router = require('express').Router()

const multer = require('multer')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/avatar')
    },
    filename: function (req, file, cb) {
        console.log(req)
        cb(null, `avatar_${req.user._id}.png`)
    }
})
var upload = multer({ storage: storage })


router.post('/scheduling', HomeController.scheduling)
router.post('/updateProfile', UserController.updateProfile)
router.post('/avatar', upload.single('avatar'), UserController.changeAvatar)

router.get('/getScheduleUser', UserController.getScheduleUser)
router.get('/', UserController.getInfor)

module.exports = router