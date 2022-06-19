const DiseaseGroup = require('../models/DiseaseGroup')

class DiseaseGroupController {

    async getDiseaseGroups(req, res) {
        const diseaseGroups = await DiseaseGroup.find()
        return res.json(diseaseGroups)
    }
}

module.exports = new DiseaseGroupController