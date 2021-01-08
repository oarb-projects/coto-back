const dbHelpers = require("../config/db.config");
const con = dbHelpers.getConnection;

function queryPromise(str) {
  return new Promise((resolve, reject) => {
    con.query(str, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

async function seedData() {
  let obj = {
    relays_tested: 200,
    final_yield: 99,
  };
  const query = `INSERT INTO test_results(part_no,test_no,final_yield,relays_tested) VALUES(777,'003456',${obj.final_yield},${obj.relays_tested});`;
  let results = await queryPromise(query);
  return results;
}

//Todo: generate seed file with Coto2 Database
/* 
Minimum requirements for all test_no:
2 different part_no, application, lot size
3 different dates,datecode sw, datecode rel, yields

*/

exports.seedData = seedData;
