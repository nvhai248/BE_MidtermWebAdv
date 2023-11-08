const User = require("../models/user.model");
const mongooseHelper = require("../utils/mongoose.helper");

class userStore {
  findUser = async (username) => {
    var user = mongooseHelper.mongoosesToObject(
      await User.findOne({ username: username })
    );
    return user;
  };

  createUser = async (user) => {
    var newUser = new User(user);
    await newUser.save();
  };

  editProfile = async (username, data) => {
    await User.updateOne({ username: username }, data);
  };
}

module.exports = new userStore();
