// const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// {
//   "username": "velvetround",
//   "name": "Zena Kelley",
//   "image": "/assets/user-images/image-zena.jpg"
// }
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
  },
  username: {
    type: String,
    required: [true, 'A User must have a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },

  image: {
    type: String,
    default: '/assets/user-images/poop.jpg',
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    default: undefined,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
});

UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model('User', UserSchema);
module.exports = User;
