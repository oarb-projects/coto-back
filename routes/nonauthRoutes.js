const express = require("express");
const router = express.Router();
const axios = require("axios");
const dbHelpers = require("../config/db.config");
const con = dbHelpers.getConnection;
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  if (req.session.loggedin) {
    return res.redirect("/filter");
  }
  res.render("login.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Login",
  });
});
router.get("/signup", (req, res) => {
  if (req.session.loggedin) {
    return res.redirect("/filter");
  }
  res.render("sign-up.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Sign Up",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

const getUsers = () => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM Coto.users;`, function (error, rows, fields) {
      if (error) {
        console.log("Failed to query " + error);
        reject(error);
      }
      const users = rows;
      resolve(users);
    });
  });
};

const registerUser = (data) => {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO Coto.users (\`username\`, \`passwords\`) VALUES (?, ?)`,
      [data.name, data.pass],
      function (error, rows, fields) {
        if (error) reject(error);
        resolve(rows);
      }
    );
  });
};

router.post("/login", async (req, res) => {
  // var fullUrl = req.protocol + "://" + req.get("host");
  // let requestUrl = `${fullUrl}/api/users`;
  const requestUrl = "/api/users";
  console.log(`=====requestUrl ${requestUrl}`);
  let users = [];
  users = await getUsers();
  // translates RowDataPacket to json object
  users = Object.values(JSON.parse(JSON.stringify(users)));
  const { name, pass } = req.body;
  var item = users.findIndex((item) => item.username === name);
  if (item == -1) {
    res.json({ status: "user not found" });
  } else {
    try {
      console.log(users[item].passwords, pass);
      const match = await bcrypt.compare(pass, users[item].passwords);
      console.log(match);
      // need to have password column of 75 char
      // https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length
      if (match) {
        req.session.loggedin = true;
        req.session.username = name;
        req.session.password = pass;
        res.json({ status: "ok" }); // res.redirect("/filter");
      } else {
        res.json({ status: "incorrect password" }); // res.redirect("/login");
      }
    } catch (e) {
      console.log("Error", e);
      res.json({ status: "error while making request" });
      res.redirect("/login");
    }
  }
});

router.post("/signup", async (req, res) => {
  const requestUrl = "/api/users";
  console.log(`=====requestUrl ${requestUrl}`);

  let users = [];
  users = await getUsers();

  users = Object.values(JSON.parse(JSON.stringify(users)));
  const { name, pass } = req.body;

  var item = users.findIndex((item) => item.username === name);

  if (item == -1) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(pass, salt);
    console.log(`hashedPassword :${hashedPassword}`);
    registerUser({ name, pass: hashedPassword });
    req.session.loggedin = true;
    req.session.username = name;
    req.session.password = hashedPassword;
    res.redirect("/filter");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
