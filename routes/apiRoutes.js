const express = require("express");
const router = express.Router();
const dbHelpers = require("../config/db.config");
const con = dbHelpers.getConnection;

router.get("/:testparam", (req, res) => {
  let param = req.params.testparam;
  console.log(param);
  con.query(`SELECT * FROM Coto.${param};`, function (error, rows, fields) {
    if (error) {
      console.log("Failed to query " + error);
      res.status(404).render("dberr.ejs");
      return;
    }
    res.json(rows);
  });
});

router.get("/users", (req, res) => {
  console.log(param);
  con.query(`SELECT * FROM Coto.users;`, function (error, rows, fields) {
    if (error) {
      console.log("Failed to query " + error);
      res.status(404).render("dberr.ejs");
    }
    res.json(rows);
  });
});

module.exports = router;
