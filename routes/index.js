const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const studentRouter = require("./studentRouter");
const teacherRouter = require("./teacherRouter");
const groupRouter = require("./groupRouter");
const subjectRouter = require("./subjectRouter");
const ratingRouter = require("./ratingRouter");
const touchRouter = require("./touchRouter");

router.use("/users", userRouter);
router.use("/students", studentRouter);
router.use("/groups", groupRouter);
router.use("/teachers", teacherRouter);
router.use("/subjects", subjectRouter);
router.use("/ratings", ratingRouter);
router.use("/tgs", touchRouter);

module.exports = router;
