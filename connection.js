import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

var mysqlConnection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "Posts",
    password: "nibodh1284",
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
