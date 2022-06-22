import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

var mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
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
