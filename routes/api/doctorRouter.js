const router = require('express').Router()
const CRUDController = require('../../app/controllers/CRUDController')
const UserController = require('../../app/controllers/UserController')
const multer = require('multer')

// const upload = multer({
//     dest: './public/avatar'
//     // you might also want to set some limits: https://github.com/expressjs/multer#limits
// });

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


router.post('/create', CRUDController.createDiseasePost)
router.post('/edit', CRUDController.editDiseasePost)
router.post('/avatar', upload.single('avatar'), UserController.changeAvatar)
router.post('/updateProfile', UserController.updateProfile)
router.get('/getTimeServing', CRUDController.getTimeServing)
router.get('/getScheduleDoctor', UserController.getScheduleDoctor)
router.post('/addTimeServing', CRUDController.addTimeServing)
router.post('/resetTimeServing', CRUDController.resetTimeServing)
router.get('/getDiseasePosts', CRUDController.getDiseasePosts)
router.get('/', CRUDController.index)

module.exports = router