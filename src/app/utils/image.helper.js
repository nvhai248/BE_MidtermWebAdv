const imageSize = require("image-size");
const s3 = require("../../configs/awss3/s3");

function isImage(buffer) {
  try {
    imageSize(buffer);
    return true;
  } catch (err) {
    return false;
  }
}

function getImageInfo(buffer, url) {
  const dimensions = imageSize(buffer);
  const extension = url.match(/\.(\w+)$/);
  return {
    width: dimensions.width,
    height: dimensions.height,
    url: url,
    cloud_name: "s3",
    extension: extension[1],
  };
}

function uploadToS3(imageInfo, buffer){
  s3.upload(
    {
      Bucket: process.env.S3BucketName,
      Key: imageInfo.url,
      Body: buffer,
      ACL: "public-read",
    },
    (err, result) => {
      if (err) {
        return false;
      }
      return true;
    }
  );
}

module.exports = { isImage, getImageInfo, uploadToS3};
