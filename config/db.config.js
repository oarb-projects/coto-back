var mysql = require("mysql");

const dbconnection = mysql.createPool({
  host: "coto-1.cjlxz9e5sgts.us-west-1.rds.amazonaws.com",
    user: "admin",
    database: 'Coto',
    password: "cfpfk5qf"
});

// Attempt to catch disconnects
dbconnection.on("connection", function (connection) {
  console.log("DB Connection established");

  connection.on("error", function (err) {
    console.error(new Date(), "MySQL error", err.code);
  });
  connection.on("close", function (err) {
    console.error(new Date(), "MySQL close", err);
  });
});

exports.getConnection = dbconnection;
