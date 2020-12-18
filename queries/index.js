const dbHelpers = require("../config/db.config");
const con = dbHelpers.getConnection;

//Pareto
const tables = [
  { name: "Actuate Time", access: "actuate_time" },
  { name: "Coils Resistance", access: "coil_resistance" },
  { name: "CRS", access: "crs" },
  { name: "DCR", access: "dcr" },
  { name: "Operate Current", access: "operate_current" },
  { name: "Operate Time", access: "operate_time" },
  { name: "Operate Voltage", access: "operate_voltage" },
];

async function getFaults(resArr) {
  var total = 0;
  var array = [];

  var textCondition = "(";
    for (var i= 0; i < resArr.length; i++) {
      textCondition += ` \`test_no\` = "${resArr[i].dut_no}"`;

      if(i < resArr.length - 1){
        textCondition += ' OR';
      }
    }
    textCondition += ")";

  for (var table of tables) {
    array.push({ name: `Falla ${table.name}`, quantity: 0 });
    
    var text = `SELECT * FROM \`${table.access}\` WHERE \`flag\` = "1" AND ${textCondition}`;
    array[array.length - 1].quantity = await getQuantity(text);

    text = `SELECT * FROM \`${table.access}\` WHERE ${textCondition}`;
    total += await getQuantity(text);
  }

  return { array: array, total: total };
}

async function getQuantity(text) {
  let results = await queryPromise(text);
  let total = results.length;
  return total;
}

function queryPromise(str) {
  return new Promise((resolve, reject) => {
    con.query(str, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

exports.getFaults = getFaults;
