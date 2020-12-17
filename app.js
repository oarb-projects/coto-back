const express = require("express");
const app = express();
var cors = require("cors");
var mysql = require("mysql");
const socket = require("socket.io");
const helpers = require("./helpers/pdfgenerator");

require("dotenv").config();

const hostname = "127.0.0.1";
var port = process.env.PORT || 8080;
const axios = require("axios");

const queries = require("./queries");
const middlewares = require("./middlewares/queryConversion");

const favicon = require("serve-favicon");
const path = require("path");

app.use(favicon(path.join(__dirname, "public", "assets", "favicon.png")));

// body parser
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

let objConnection = require("./config/db.config.js").objConnection;
var connection = mysql.createConnection(objConnection);

app.get("/", (req, res) => {
  res.render("menu.ejs");
});

app.post("/filterdb", async (req, res) => {
  console.log(req.body);
  const filterData = DTO.convertData(req.body);
  const resArr = await filter.getData(filterData);
  res.json(resArr);
});

app.get("/charts", (req, res) => {
  res.render("charts.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    pdfGenerator: "genpdf2.ejs",
    title: "Chart",
  });
});

app.get("/pareto", middlewares.convertQueryMiddle, (req, res) => {
  console.log(res.locals.resArr);
  queries.getFaults().then((faults) => {
    res.render("pareto.ejs", {
      navbar: "navbar.ejs",
      footer: "footer.ejs",
      title: "Pareto Analysis",
      faults: faults.array,
      total: faults.total,
    });
  });
});

app.get("/summary", middlewares.convertQueryMiddle, async (req, res) => {
  console.log(res.locals.resArr);
  res.render("summary.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Summary",
  });
});

app.get("/chartsjs", middlewares.convertQueryMiddle, (req, res) => {
  console.log(res.locals.resArr);
  res.render("chartsjs.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    chart_legend: "chartjs-legend.ejs",
    title: "Chart",
  });
});

app.get("/testinfo", middlewares.convertQueryMiddle, (req, res) => {
  res.render("testinfo.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Test Information",
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Login",
  });
});

app.post("/login", (req, res) => {
  var fullUrl = req.protocol + "://" + req.get("host");
  let requestUrl = `${fullUrl}/api/users`;
  console.log("=====requestUrl");
  console.log(requestUrl);
  axios
    .get(requestUrl)
    .then(function (response) {
      let arr = response.data;
      var item = arr.findIndex((item) => item.username === req.body.name);
      console.log(item);
      if (item == -1) {
        res.redirect("/login");
      } else {
        console.log(arr[item].passwords);
        if (arr[item].passwords == req.body.pass) {
          res.redirect("/filter");
        } else {
          res.redirect("/login");
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("there was an error");
      res.end();
    });
});

app.get("/filter", (req, res) => {
  res.render("filter.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "File Selection Criteria",
  });
});

app.get("/api/:testparam", (req, res) => {
  let param = req.params.testparam;
  console.log(param);
  connection.query(
    `SELECT * FROM Coto.${param};`,
    function (error, rows, fields) {
      if (error) {
        console.log("Failed to query " + error);
        res.status(404).render("dberr.ejs");
        return;
      }
      res.json(rows);
    }
  );
});

app.get("/api/users", (req, res) => {
  console.log(param);
  connection.query(`SELECT * FROM Coto.users;`, function (error, rows, fields) {
    if (error) {
      console.log("Failed to query " + error);
      res.status(404).render("dberr.ejs");
    }
    res.json(rows);
  });
});

app.use(function (req, res) {
  res.status(404).render("404.ejs");
});

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));
const server = app.listen(port, () =>
  console.log(`Coto Report Generator App is running at port: ${port}!`)
);

const io = socket(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("generate-pdf", (arg) => {
    // console.log(arg);
    helpers.chartGenerator(1500, 1600, socket);
  });
});
