const express = require("express");
const app = express();
var cors = require("cors");
const socket = require("socket.io");
const helpers = require("./helpers/pdfgenerator");

/* app setup */
const port = process.env.PORT || 8080;
const hostname = "127.0.0.1";
require("./config/db.config");

// const os = require("os");
// const hostname = os.hostname();

/* Local env files*/
/* require("dotenv").config(); */

/*Setting favicon of our app*/
const favicon = require("serve-favicon");
const path = require("path");
app.use(favicon(path.join(__dirname, "public", "assets", "favicon.png")));

/* General middlewares of our app*/
/* parse application/x-www-form-urlencoded and parse application/json */
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

/*Routers used*/
const nonauthRoutes = require("./routes/nonauthRoutes");
const authenticatedRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
app.use("/", nonauthRoutes);
app.use("/", authenticatedRoutes);
app.use("/api/", apiRoutes);

/* Invalid routes final middleware */
app.use(function (_, res) {
  res.status(404).render("404.ejs");
});

const server = app.listen(port, () =>
  console.log(
    `Coto Report Generator App is running at host: ${
      server.address().address
    } port: ${server.address().port}!`
  )
);
/* Socket connection */
const io = socket(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("generate-pdf", (arg) => {
    helpers.chartGenerator(socket, arg);
  });
});
