const Router = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/", userController.getAll);
router.get("/auth", authMiddleware, userController.check);
router.delete("/:user_id", userController.remove);

module.exports = router;
