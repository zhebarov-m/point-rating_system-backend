const Router = require("express");
const studentController = require("../controllers/studentController");
const router = new Router();

router.post("/", studentController.create);
router.get("/", studentController.getAll);
router.get("/st", studentController.getST);
router.get("/groups/:group_id/subjects/:subject_id/rating", studentController.getSubjectRating);
router.get("/:group", studentController.getAll);
router.get("/oneStudent/:student_id", studentController.getOne);

module.exports = router;
