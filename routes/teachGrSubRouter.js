const Router = require("express");
const teachGrSubController = require("../controllers/teachGrSubController");
const router = new Router();

router.get("/", teachGrSubController.getAll);

module.exports = router;
