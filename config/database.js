const mongoose = require("mongoose");

const connect_Db = async (callback) => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    callback(null, "Database connected");
  }).catch((err) => {
    callback(err, null);
  })

};

module.exports = {
  connect_Db,
};
