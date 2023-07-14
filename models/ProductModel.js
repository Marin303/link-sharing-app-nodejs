const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter a last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
