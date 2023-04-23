var mysql = require("mysql");

var db = mysql.createConnection({
    host: 'cloudmusic-user-db.cy6mjxluekwg.ap-southeast-1.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'forgroupass!gnment', 
    database: 'cloudmusic_user_db'
});

db.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
   }
    console.log('Connected to database.');
});

// db.end();
module.exports = db;