var mysql = require("mysql");

var config = {
    host: 'cloudmusic-user-db.cy6mjxluekwg.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password : 'forgroupass!gnment',
    database: 'cloud_music',
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
