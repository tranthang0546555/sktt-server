const homeRouter = require('./homeRouter')
const diseaseRouter = require('./diseaseRouter')
const diseaseGroupRouter = require('./diseaseGroupRouter')
const authRouter = require('./authRouter')
const commentRouter = require('./commentRouter')
const userRouter = require('./userRouter')
const doctorRouter = require('./doctorRouter')
const authMiddlewares = require('../../app/auth/auth.middlewares')
const authUserMiddlewares = require('../../app/auth/auth.user.middlewares')
const authDoctorMiddlewares = require('../../app/auth/auth.doctor.middleware')
const express = require('express')
const UserController = require('../../app/controllers/UserController')
const router = express.Router()

router.use('/disease', diseaseRouter)
router.use('/diseaseGroup', diseaseGroupRouter)
router.use('/auth', authRouter)

router.use('/home', homeRouter)

const isAuthUser = authUserMiddlewares.isAuth
router.use('/user', isAuthUser, userRouter)
const isAuthDoctor = authDoctorMiddlewares.isAuth
router.use('/doctor', isAuthDoctor, doctorRouter)
router.use('/comment', commentRouter)

const isAuth = authMiddlewares.isAuth
router.use('/room/:codeRoom', isAuth, UserController.joinRoom)
router.get('/getNotification', isAuth, UserController.getNotification)
router.post('/readNotification', isAuth, UserController.readNotification)

router.use('*', (req, res) => {
    res.status(404).send("Not found")
})

module.exports = router