const Router = require('express')
const subjectController = require('../controllers/subjectController')
const router = new Router()

router.post('/', subjectController.create)
router.get('/', subjectController.getAll)
router.get('/:subject_id', subjectController.getOne)


module.exports = router