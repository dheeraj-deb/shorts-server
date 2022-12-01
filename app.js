require("dotenv").config();
const http = require("http");
const cors = require("cors");
const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const { connect_Db } = require("./config/database");

const app = express();
const server = http.createServer(app);

// middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const PORT = process.env.PORT || 8080;

connect_Db((err, data) => {
  err ? console.log(err) : console.log(data);
})


app.use("/shorts/api/auth", require("./routes/auth"));
app.use("/shorts/api/admin", require("./routes/admin"));
app.use("/shorts/api", require("./routes/user"));
app.use("/shorts/api/chat", require('./routes/chat'))
app.use("/shorts/api/message", require('./routes/message'))

app.use(errorHandler);

app.listen(PORT, () => console.log(`server is alive at ${PORT}`));
