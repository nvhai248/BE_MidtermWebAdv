const userStore = require("../storages/user.store");
const hasher = require("../../configs/hasher");
const jwt = require("../../configs/jwt");
const tokenStore = require("../storages/token.store");
const { simpleSuccessResponse } = require("../views/response_to_client");
const {
  errorNotFound,
  errorCustom,
  errorBadRequest,
} = require("../views/error");

class USerController {
  // get all users
  async getUser(req, res) {
    var username = req.user;
    const user = await userStore.findUser(username);
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
    const existingUser = await userStore.findUser(data.username);
    if (existingUser) {
      return res.status(400).send(errorCustom(400, "Username already exists!"));
    }
    data.password = hasher.encode(data.password);
    userStore.createUser(data);

    res.status(201).send(errorCustom(201, "Sign up successful!"));
  }

  // login POST /user/login
  async login(req, res) {
    const data = req.body;

    const user = await userStore.findUser(data.username);

    if (!user || !hasher.compare(user.password, data.password)) {
      return res
        .status(400)
        .send(errorCustom(400, "Username or password incorrect!"));
    }

    const token = jwt.generateToken(data);
    // if user re-login save new token
    // else create new token in database

    await tokenStore.createToken({
      token: token,
      username: data.username,
    });

    res.status(201).send(simpleSuccessResponse(token, "Sign in successfully!"));
  }

  // [PATCH] /user/profile
  async editProfile(req, res) {
    const username = req.user;
    const data = req.body;

    if (!username || !data) {
      res.status(400).send(errorBadRequest());
    }

    await userStore.editProfile(username, data);
    const newData = await userStore.findUser(username);
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
}

module.exports = new USerController();
