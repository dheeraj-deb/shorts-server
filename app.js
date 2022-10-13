const express = require("express");
const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

const server = http.createServer(app);


const { connect_Db } = require("./util/database");

connect_Db((val) => {
  val ? console.log("connected") : null;
});



app.listen(PORT, () => console.log(`server is alive at ${PORT}`));
