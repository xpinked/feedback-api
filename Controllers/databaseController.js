const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const DB = process.env.MDB_DATABASE.replace(
  '<MDB_USERNAME>',
  process.env.MDB_USERNAME
).replace('<MDB_PASSWORD>', process.env.MDB_PASSWORD);

exports.DBController = async function () {
  let msg;
  try {
    const con = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    msg = 'connected.. waiting for progress';
    return con;
  } catch {
    msg = 'didnt work';
  } finally {
    console.log(msg);
  }
};
