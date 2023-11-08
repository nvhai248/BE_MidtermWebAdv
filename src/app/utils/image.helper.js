const imageSize = require("image-size");

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

module.exports = { isImage, getImageInfo };
