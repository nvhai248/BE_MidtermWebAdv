const express = require(`express`);
const router = express.Router();

const userRouter = require("../app/controllers/user.controller");
const authenticate = require("../app/middlewares/authenticate");

router.delete("/logout", authenticate, userRouter.logout);
router.patch("/profile", authenticate, userRouter.editProfile);
router.get("/profile", authenticate, userRouter.getUser);
router.post("/register", userRouter.register);
router.post("/login", userRouter.login);

module.exports = router;
