const express = require(`express`);
const router = express.Router();

const userRouter = require("../app/controllers/user.controller");
const authenticate = require("../app/middlewares/authenticate");
const uploadImage = require("../app/middlewares/uploadImage");

router.delete("/logout", authenticate, userRouter.logout);
router.patch("/profile", authenticate, userRouter.editProfile);
router.patch("/image", authenticate, uploadImage, userRouter.editProfile);
router.get("/profile", authenticate, userRouter.getUser);
router.post("/register", userRouter.register);
router.post("/login", userRouter.login);

module.exports = router;
