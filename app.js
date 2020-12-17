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
const filter = require("./queries/filter");

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

app.get("/pareto", (req, res) => {
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

app.get("/filterdb", async (req, res) => {
  //   resArr = await filter.getData();
  resArr = await filter.getData2();
  res.json(resArr);
});
app.post("/filterdb", async (req, res) => {
  console.log(req.body);
  const filterData = {
    date_time: ` BETWEEN '${req.body.date1}' AND '${req.body.date2}' `,
    part_no: req.body.part_no != "" ? ` = '${req.body.part_no}'` : "",
    plt: req.body.plt != "" ? ` = '${req.body.plt}'` : "",
    test_type: req.body.application != "" ? ` = '${req.body.application}'` : "",
  };
  //   resArr = await filter.getData();
  resArr = await filter.getData2(filterData);
  res.json(resArr);
});

app.get("/summary", (req, res) => {
  res.render("summary.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    // pdfGenerator: "genpdf2.ejs",
    title: "Summary",
  });
});

app.get("/charts", (req, res) => {
  res.render("charts.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    pdfGenerator: "genpdf2.ejs",
    title: "Chart",
  });
});

app.get("/chartsjs", (req, res) => {
  res.render("chartsjs.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    chart_legend: "chartjs-legend.ejs",
    title: "Chart",
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

app.get("/testinfo", (req, res) => {
  res.render("testinfo.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Test Information",
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
