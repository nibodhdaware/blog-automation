import mysql from "mysql2";

var mysqlConnection = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQLDATABASE,
    password: process.env.MYSQLPASSWORD,
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
