require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require('cors')

const { connect_Db } = require("./util/database");


const app = express();
const server = http.createServer(app);

// middlewares
app.use(bodyParser.json());
app.use(cors())

const PORT = process.env.PORT || 8080;

connect_Db((val) => {
  val ? console.log("connected") : null;
});

app.use("/shorts/api/auth", require("./routes/auth"));
app.use('/shorts/api', require('./routes/user'))

app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ message: err.message, path: req.path });
  next()
});

app.listen(PORT, () => console.log(`server is alive at ${PORT}`));
