const Router = require('express')
const teacherController = require('../controllers/teacherController')
const router = new Router()

router.post('/', teacherController.create)
router.get('/', teacherController.getAll)
router.get('/:teacher_id', teacherController.getOne)


module.exports = router