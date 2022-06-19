const express = require('express')
const router = express.Router()
const DiseasePostController = require('../../app/controllers/DiseasePostController')

router.get('/:slug', DiseasePostController.getDiseasePost)
router.get('/', DiseasePostController.index)
router.post('/vote', DiseasePostController.vote)

module.exports = router
