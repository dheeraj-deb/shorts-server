const mongoose = require("mongoose");

let obj = {};

const connect_Db = async (callback) => {
  // const connection =  mongoose.createConnection(process.env.MONGODB_URI)
  mongoose.connect(process.env.MONGODB_URI);
  const connection = mongoose.connection;

  connection.on("open", () => {
    obj.gfs = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: "uploads",
    });
    callback(null, "Database connected");
  });

  connection.on("error", (err) => {
    if (err) return callback(err, null);
  });
};

module.exports = {
  connect_Db,
  obj,
};
