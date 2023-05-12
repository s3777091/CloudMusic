var mysql = require("mysql");


//This one for cloud
var config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    sslmode: 'REQUIRED',
    port: '3306'
};


var pool = mysql.createPool(config);
function RunQuery(sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            ShowErrors(err);
        }
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                ShowErrors(err);
            }
            conn.release();
            callback(rows);
        });
    });
}

//handle err
function ShowErrors(err) {
    throw err;
}

module.exports = {
    RunQuery: RunQuery
};