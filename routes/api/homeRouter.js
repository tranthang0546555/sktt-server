const express = require('express')
const router = express.Router()
const HomeController = require('../../app/controllers/HomeController')

router.get('/getDoctor/:id', HomeController.getDoctor)
router.get('/getDoctors', HomeController.getDoctors)
router.get('/chooseTime', HomeController.chooseTime)
router.get('/search', HomeController.search)
router.get('/getIntro', HomeController.getIntro)

router.get('/getUi', HomeController.getUI)
router.get('/', HomeController.index)

module.exports = router