const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const TasksController = require("../controllers/TasksController");
const AuthVerificationMiddleware = require("../middlewares/AuthVerificationMiddleware");


router.post("/registration", UsersController.registration)
router.post("/userLogin", UsersController.userLogin)
router.post("/upadateProfile",AuthVerificationMiddleware, UsersController.upadateProfile)
// profile details
router.get("/profileDetails",AuthVerificationMiddleware, UsersController.profileDetails)

// createing task
router.post("/createTask",AuthVerificationMiddleware, TasksController.createTask)
router.delete("/deleteTask/:id",AuthVerificationMiddleware, TasksController.deleteTask)
router.get("/updateStatus/:id/:status",AuthVerificationMiddleware, TasksController.updateStatus)


router.get("/listByStatus/:status",AuthVerificationMiddleware, TasksController.listByStatus)
router.get("/listTaskCount",AuthVerificationMiddleware, TasksController.listTaskCount)


// recovery
router.get("/emailVerify/:email", UsersController.verifyEmail)
router.get("/otpVerify/:email/:otp", UsersController.verifyOtp)
router.post("/setNewPass", UsersController.setNewPass)

module.exports = router;