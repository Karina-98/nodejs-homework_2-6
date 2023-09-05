const express = require("express");

const ctrl = require("../../controllers/auth")

const router = express.Router();

const  {validateBody, authenticate, upload}  = require("../../middlewares");
const { registerUserSchema, loginUserSchema, emailSchema } = require("../../schemasValidation/authSchema")

router.post("/users/register", validateBody(registerUserSchema), ctrl.registration)

router.get("/users/verify/:verificationToken", ctrl.verifyEmail)

router.post("/users/verify", validateBody(emailSchema), ctrl.resendVerifyEmail)

router.post("/users/login", validateBody(loginUserSchema), ctrl.login)

router.get("/users/current", authenticate, ctrl.getCurrent)

router.post("/users/logout", authenticate, ctrl.logout)

router.patch("/users/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;