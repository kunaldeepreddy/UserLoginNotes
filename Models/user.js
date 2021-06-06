const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String ,required: [true, 'email ID is required.'] },
  password: String,
  username: { type: String ,required: [true, 'Username is required.'] },
  mobile_number: { type: String ,required: [true, 'mobile number is required.'] },
});

module.exports = mongoose.model("User", userSchema);