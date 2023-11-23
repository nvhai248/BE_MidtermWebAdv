const userStore = require("../storages/user.store");
const hasher = require("../../configs/hasher");
const jwt = require("../../configs/jwt");
const tokenStore = require("../storages/token.store");
const { simpleSuccessResponse } = require("../views/response_to_client");
const {
  errorNotFound,
  errorCustom,
  errorBadRequest,
  errorInternalServer 
} = require("../views/error");
const {uploadToS3, isImage, getImageInfo } = require("../utils/image.helper");
const imageStore = require("../storages/image.store");

class USerController {
  // get all users
  async getUser(req, res) {
    var userId = req.user.userId;
    const user = await userStore.findUserById(userId);
    if (!user) {
      res.status(404).send(errorNotFound("User"));
    }
    delete user.password;
    res.status(200).send(simpleSuccessResponse(user, "ok"));
  }

  // register POST /user/register
  async register(req, res) {
    var data = req.body;
    if (!data.username || !data.password) {
      return res
        .status(400)
        .send(errorCustom(400, "Username or password not be blank!"));
    }
    const existingUser = await userStore.findUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).send(errorCustom(400, "Username already exists!"));
    }

    if(!data.role) {
      data.role = "student";
    }
    data.password = hasher.encode(data.password);
    userStore.createUser(data);

    res.status(201).send(errorCustom(201, "Sign up successful!"));
  }

  // login POST /user/login
  async login(req, res) {
    const data = req.body;

    const user = await userStore.findUserByUsername(data.username);

    if (!user || !hasher.compare(user.password, data.password)) {
      return res
        .status(400)
        .send(errorCustom(400, "Username or password incorrect!"));
    }

    const token = jwt.generateToken({userId: user._id, role: user.role});
    // if user re-login save new token
    // else create new token in database

    await tokenStore.createToken({
      token: token,
      userId: data._id,
    });

    res.status(201).send(simpleSuccessResponse(token, "Sign in successfully!"));
  }

  // [PATCH] /user/profile
  async editProfile(req, res) {
    const userId = req.user.userId;
    const data = req.body;

    if (!userId || !data) {
      res.status(400).send(errorBadRequest());
    }

    await userStore.editProfile(userId, data);
    const newData = await userStore.findUserById(userId);
    res
      .status(200)
      .send(simpleSuccessResponse(newData, "Successfully updated profile!"));
  }

  // [DELETE] /user/logout
  async logout(req, res) {
    const authorizationHeader = req.header("Authorization");
    let tokenStr = "";
    const parts = authorizationHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      tokenStr = parts[1];
    }

    await tokenStore.deleteTokenByTokenStr(tokenStr);
    res.status(200).send(simpleSuccessResponse(null, "Sign out successfully!"));
  }

  // [PATCH] /user/avatar
  updatedAvatar = async (req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific origin if needed
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
    let check = await uploadToS3(imageInfo, buffer); 
    if(check) {
      // return image information to Client
      imageInfo.url = process.env.S3Domain + "/" + imageInfo.url;
      var userId = req.user.userId;
      imageInfo.created_by = userId;

      await imageStore.create(imageInfo);
      await userStore.editProfile(userId, {image: imageInfo});
      var user = await userStore.findUserById(userId);
      res
        .status(200)
        .send(simpleSuccessResponse(user, "Successfully updated!"));
    } else {
      res.status(500).send(errorInternalServer("Something went wrong when upload image!"));
    }
  };
}

module.exports = new USerController();
