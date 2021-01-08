const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("menu.ejs");
});

router.get("/charts", (req, res) => {
  res.render("charts.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    pdfGenerator: "genpdf2.ejs",
    title: "Chart",
  });
});

router.get("/login", (req, res) => {
  res.render("login.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Login",
  });
});

router.post("/login", (req, res) => {
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

module.exports = router;
