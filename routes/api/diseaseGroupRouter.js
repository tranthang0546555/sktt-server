const router = require('express').Router()
const DiseaseGroupController = require('../../app/controllers/DiseaseGroupController')

router.get('/', DiseaseGroupController.getDiseaseGroups)

module.exports = router