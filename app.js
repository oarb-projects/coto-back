const express = require("express");
const app = express();
var cors = require("cors");
const socket = require("socket.io");
const helpers = require("./helpers/pdfgenerator");

/* app setup */
const hostname = "127.0.0.1";
var port = process.env.PORT || 8080;

/* Local env files*/
// require("dotenv").config();

/*Setting favicon of our app*/
const favicon = require("serve-favicon");
const path = require("path");
app.use(favicon(path.join(__dirname, "public", "assets", "favicon.png")));

/* General middlewares of our app*/
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

/*Routers used*/
const nonauthRoutes = require("./routes/nonauthRoutes");
const authenticatedRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
app.use("/", nonauthRoutes);
app.use("/", authenticatedRoutes);
app.use("/api/", apiRoutes);

/* Invalid routes */
app.use(function (req, res) {
  res.status(404).render("404.ejs");
});

const server = app.listen(port, () =>
  console.log(`Coto Report Generator App is running at port: ${port}!`)
);

/* Socket connection */
const io = socket(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("generate-pdf", (arg) => {
    // console.log(arg);
    helpers.chartGenerator(1500, 1600, socket);
  });
});
