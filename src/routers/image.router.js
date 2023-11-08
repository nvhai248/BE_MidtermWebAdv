const express = require(`express`);
const router = express.Router();

const imageRouter = require("../app/controllers/image.controller");
const uploadImage = require("../app/middlewares/uploadImage");

router.post("/image", uploadImage, imageRouter.uploadImage);

module.exports = router;
