var mysql = require("mysql");

let objConnection = require("../config/db.config.js").objConnection;
var con = mysql.createConnection(objConnection);
console.log(objConnection);

con.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Data Base connected!");
  }
});

const query =
  "CALL `Coto`.`filterbyDate`('2020-10-10 12:00:00','2020-10-10 12:00:02');";

function queryPromise(str) {
  return new Promise((resolve, reject) => {
    con.query(str, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

async function getData() {
  let results = await queryPromise(query);
  return results;
}

async function MultipleFilter(filterData) {
  let paramsCounter = 0;
  const table = "test_description";
  let newQuery = "";
  for (var key in filterData) {
    if (filterData.hasOwnProperty(key)) {
      if (filterData[key] != "") {
        let prefix = paramsCounter == 0 ? "WHERE" : "AND";
        let partialQuery = ` ${prefix} (${table}.${key} ${filterData[key]})`;
        console.log(partialQuery);
        newQuery += partialQuery;
        paramsCounter++;
      }
    }
  }
  const finalQuery = `	SELECT * FROM ${table} ${newQuery}`;
  // console.log(finalQuery);
  let results = await queryPromise(finalQuery);
  return results;
}

// exports.getData = getData;
exports.getData = MultipleFilter;
