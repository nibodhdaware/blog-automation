import mysql from "mysql2";

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Posts",
  password: process.env.DB_PASS,
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});

// module.exports = mysqlConnection;
export default mysqlConnection;
