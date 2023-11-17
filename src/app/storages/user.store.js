const User = require("../models/user.model");
const mongooseHelper = require("../utils/mongoose.helper");

class userStore {
  findUserByUsername = async (username) => {
    var user = mongooseHelper.mongoosesToObject(
      await User.findOne({ username: username })
    );
    return user;
  };

  findUserById = async (id) => {
    var user = mongooseHelper.mongoosesToObject(
      await User.findOne({ _id: id })
    );
    return user;
  };

  createUser = async (user) => {
    var newUser = new User(user);
    await newUser.save();
  };

  editProfile = async (userId, data) => {
    await User.updateOne({ _id: userId }, data);
  };
}

module.exports = new userStore();
