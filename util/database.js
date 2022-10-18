const mongoose = require("mongoose");

exports.connect_Db = (callback) => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(
      (data) => {
        callback(true);
      },
      (err) => {
        callback(err);
      }
    );
};
