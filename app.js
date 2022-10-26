require("dotenv").config();
const http = require("http");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const multer = require('multer');
const { errorHandler } = require("./middleware/errorHandler");
const { connect_Db, gfs } = require("./config/database");

const app = express();
const server = http.createServer(app);

// middlewares
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

connect_Db((err, data) => {
  err ? console.log(err) : console.log(data);
})


app.use("/shorts/api/auth", require("./routes/auth"));
app.use("/shorts/api/admin", require("./routes/admin"));
app.use("/shorts/api", require("./routes/user"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`server is alive at ${PORT}`));
