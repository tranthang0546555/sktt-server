const express = require('express')
const AuthController = require('../../app/controllers/AuthController')
const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refreshToken)
router.post('/token', AuthController.authTokenLogin)
module.exports = router