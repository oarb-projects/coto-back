const dbHelpers = require("../config/db.config");
const con = dbHelpers.getConnection;

//Pareto
const parameters = [
  {
    id: "CR",
    name: "Coil Resistance",
    access: "coil_resistance",
    scaleUnits: "Ohms",
    limitA: 35,
    limitB: 45,
    width: 0.5,
  },
  {
    id: "OV",
    name: "Operate Voltage",
    access: "operate_voltage",
    scaleUnits: "Volts",
    limitA: 1.1,
    limitB: 3.7,
    width: 0.1,
  },
  {
    id: "RV",
    name: "Release Voltage",
    access: "release_voltage",
    scaleUnits: "Volts",
    limitA: 1.1,
    limitB: 3.7,
    width: 0.1,
  },
  {
    id: "SCR",
    name: "Static CR",
    access: "scr",
    scaleUnits: "Ohms",
    limitA: 0.02,
    limitB: 0.2,
    width: 0.025,
  },
  {
    id: "AT",
    name: "Actuate Time",
    access: "actuate_time",
    scaleUnits: "Usecs",
    limitA: 30,
    limitB: 50,
    width: 0.5,
  },
  {
    id: "RT",
    name: "Release Time",
    access: "release_time",
    scaleUnits: "Usecs",
    limitA: 40,
    limitB: 60,
    width: 1,
  },
  // {
  //   id: "K",
  //   name: "Actuate Time",
  //   access: "actuate_time",
  //   scaleUnits: "Usecs",
  //   limitA: 30,
  //   limitB: 50,
  //   width: 0.5,
  // },
  // {
  //   id: "P",
  //   name: "Release Time",
  //   access: "release_time",
  //   scaleUnits: "Usecs",
  //   limitA: 40,
  //   limitB: 60,
  //   width: 1,
  // }
];

async function getFaults(resArr) {
  var map = new Map();

  for (var element of resArr) {
    var array = [];

    for (var table of parameters) {
      var quantity = await getQuantity(
        `SELECT * FROM \`${table.access}\` WHERE \`flag\` = "1" AND \`test_no\` = "${element.dut_no}"`
      );
      array.push({ name: `Falla ${table.name}`, quantity: quantity });
    }

    map.set(element.dut_no, { total: resArr.length, array: array });
  }

  var array = [];
  for (var i = 0; i < parameters.length; i++) {
    var quantity = 0;
    map.forEach(function (value, key, map) {
      quantity += value.array[i].quantity;
    });
    array.push({ name: `Falla ${parameters[i].name}`, quantity: quantity });
  }
  map.set("TOTAL", { total: resArr.length, array: array });

  return JSON.stringify(map, replacer);
}

async function getQuantity(text) {
  let results = await queryPromise(text);
  let total = results.length;

  return total;
}

async function getChartData(resArr) {
  var map = new Map();

  for (var element of resArr) {
    var tables = JSON.parse(JSON.stringify(parameters));

    for (var table of tables) {
      table.data = await queryPromise(
        `SELECT result1 FROM \`${table.access}\` WHERE \`test_no\` = "${element.dut_no}"`
      );
      table.measures = await queryPromise(
        `SELECT AVG(result1), MIN(result1), MAX(result1) FROM \`${table.access}\` WHERE \`test_no\` = "${element.dut_no}"`
      );
    }

    map.set(element.dut_no, tables);
  }

  return JSON.stringify(map, replacer);
}

async function getTestInfo(resArr) {
  var map = new Map();

  for (var element of resArr) {
    map.set(element.dut_no, element);
  }

  return JSON.stringify(map, replacer);
}

function queryPromise(str) {
  return new Promise((resolve, reject) => {
    con.query(str, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

function replacer(key, value) {
  const originalObject = this[key];
  if (originalObject instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(originalObject.entries()), // or with spread: value: [...originalObject]
    };
  } else {
    return value;
  }
}

exports.getFaults = getFaults;
exports.getChartData = getChartData;
exports.getTestInfo = getTestInfo;
