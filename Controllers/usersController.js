const User = require('../Models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
