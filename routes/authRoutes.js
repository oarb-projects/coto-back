const express = require("express");
const router = express.Router();

/* Route specific middlewares */
const middlewares = require("../middlewares/queryConversion");
const queries = require("../queries");
// TODO auth middleware

router.get("/filter", (req, res) => {
  res.render("filter.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "File Selection Criteria",
  });
});

router.get("/pareto", middlewares.convertQueryMiddle, (req, res) => {
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

router.get("/summary", middlewares.convertQueryMiddle, async (req, res) => {
  console.log(res.locals.resArr);
  res.render("summary.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Summary",
  });
});

router.get("/chartsjs", middlewares.convertQueryMiddle, (req, res) => {
  console.log(res.locals.resArr);
  res.render("chartsjs.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    chart_legend: "chartjs-legend.ejs",
    title: "Chart",
  });
});

router.get("/testinfo", middlewares.convertQueryMiddle, (req, res) => {
  console.log(res.locals.resArr);
  res.render("testinfo.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "Test Information",
  });
});

router.post("/filterdb", middlewares.convertBodyMiddle, async (req, res) => {
  const resArr = res.locals.resArr;
  console.log(resArr);
  res.json(resArr);
});

module.exports = router;
