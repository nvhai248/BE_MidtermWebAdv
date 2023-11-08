const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3ApiKey,
  secretAccessKey: process.env.S3Secret,
  region: process.env.S3Region,
});

module.exports = s3;
