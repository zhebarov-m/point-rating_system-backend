const Router = require("express");
const groupController = require("../controllers/groupController");
const checkRole = require("../middleware/checkRoleMiddleware");
const router = new Router();

router.post("/", groupController.create);
// router.post("/", checkRole("ADMIN"), groupController.create);
router.get("/", groupController.getAll);
router.get("/name/:groupName", groupController.getAll);
router.get("/:group_id", groupController.getOne);
router.delete("/:group_id", groupController.remove);

module.exports = router;
