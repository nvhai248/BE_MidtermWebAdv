const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    full_name: { type: String },
    username: { type: String },
    password: { type: String },
    created_at: { type: String },
    updated_at: { type: String },
    email: { type: String },
    phone_number: { type: String },
    birthday: { type: String },
    social_id: { type: String },
    address: { type: String },
    image: {type: Object},
  },
  {
    collection: "users",
    timestamps: true,
  }
);

module.exports = mongoose.model("users", User);
