const Router = require("express");
const ratingController = require("../controllers/ratingController.js");
const router = new Router();

// router.post('/', ratingController.create)
router.post("/", ratingController.create);
router.put("/:studentId/:subjectId", ratingController.update);
router.get("/", ratingController.getAll);

module.exports = router;
