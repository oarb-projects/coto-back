const express = require("express");
const router = express.Router();

/* Route specific middlewares */
const middlewares = require("../middlewares/queryConversion");
const authMiddlewares = require("../middlewares/authMiddleware");
const queries = require("../queries");
// TODO auth middleware

router.get("/filter", authMiddlewares.checkSession, (req, res) => {
  res.render("filter.ejs", {
    navbar: "navbar.ejs",
    footer: "footer.ejs",
    title: "File Selection Criteria",
  });
});

router.get(
  "/pareto",
  authMiddlewares.checkSession,
  middlewares.convertQueryMiddle,
  (req, res) => {
    console.log(res.locals.resArr);
    queries.getFaults(res.locals.resArr).then((faults) => {
      res.render("pareto.ejs", {
        navbar: "navbar.ejs",
        footer: "footer.ejs",
        title: "Pareto Analysis",
        faults: faults,
      });
    });
  }
);

router.get(
  "/tables",
  authMiddlewares.checkSession,
  middlewares.convertQueryMiddle,
  (req, res) => {
    console.log(res.locals.resArr);
    queries.getTables(res.locals.resArr).then((data) => {
      res.render("tables.ejs", {
        navbar: "navbar.ejs",
        footer: "footer.ejs",
        title: "Tables",
        data,
      });
    });
  }
);

router.get(
  "/summary",
  authMiddlewares.checkSession,
  middlewares.convertQueryMiddle,
  async (req, res) => {
    console.log(res.locals.resArr);
    res.render("summary.ejs", {
      navbar: "navbar.ejs",
      footer: "footer.ejs",
      title: "Summary",
    });
  }
);

router.get(
  "/chartsjs",
  authMiddlewares.checkSession,
  middlewares.convertQueryMiddle,
  (req, res) => {
    console.log(res.locals.resArr);
    queries.getChartData(res.locals.resArr).then((data) => {
      res.render("chartsjs.ejs", {
        navbar: "navbar.ejs",
        footer: "footer.ejs",
        chart_legend: "chartjs-legend.ejs",
        title: "Chart",
        data: data,
      });
    });
  }
);

router.get(
  "/testinfo",
  authMiddlewares.checkSession,
  middlewares.convertQueryMiddle,
  (req, res) => {
    console.log(res.locals.resArr);
    queries.getTestInfo(res.locals.resArr).then((data) => {
      res.render("testinfo.ejs", {
        navbar: "navbar.ejs",
        footer: "footer.ejs",
        title: "Test Information",
        data: data,
      });
    });
  }
);

router.post(
  "/filterdb",
  authMiddlewares.checkSession,
  middlewares.convertBodyMiddle,
  async (req, res) => {
    const resArr = res.locals.resArr;
    console.log(resArr);
    res.json(resArr);
  }
);

module.exports = router;
