const { errorCustom, errorInternalServer } = require("../views/error");
const imageStore = require("../storages/image.store");
const { simpleSuccessResponse } = require("../views/response_to_client");
const { isImage, getImageInfo } = require("../utils/image.helper");
const path = require("path");
const s3 = require("../../configs/awss3/s3");

class ImageController {
  // [POST] /upload_img
  uploadImage = async (req, res, next) => {
    // res.header("Access-Control-Allow-Origin", ["http://localhost", "*"]); // Allow requests from all origins
    // res.header("Access-Control-Allow-Methods", "*");
    // res.header("Access-Control-Allow-Headers", "*");

    if (!req.file) {
      res.status(400).send(errorCustom(400, "Uploaded file not found!"));
    }

    const buffer = req.file.buffer;
    const url = "imgs/" + Date.now() + "-" + req.file.originalname;

    if (!isImage(buffer)) {
      return res
        .status(400)
        .send(errorCustom(400, "Uploaded file must be an image!"));
    }

    var imageInfo = getImageInfo(buffer, url);

    // Upload file to AWS S3
    s3.upload(
      {
        Bucket: process.env.S3BucketName,
        Key: imageInfo.url,
        Body: buffer,
        ACL: "public-read",
      },
      (err, result) => {
        if (err) {
          return res.status(500).send(errorInternalServer(err.message));
        }

        // return image information to Client
        imageInfo.url = process.env.S3Domain + "/" + imageInfo.url;

        imageStore.create(imageInfo);
        res
          .status(200)
          .send(simpleSuccessResponse(imageInfo, "Successfully uploaded!"));
      }
    );
  };
}

module.exports = new ImageController();
