// database connection
const db = require("../module/db");
const bcrypt = require('bcrypt');


const handleNewUser = async (req, res) => {
    const id = req.body.user_id;
    const pwd = req.body.user_pwd;
    const encryptedPwd = await bcrypt.hash(pwd, 10);
    
    var query = "SELECT id FROM users WHERE id = '" + id + "';";
    db.query(query, function(err, rows) {
        if(rows.length == 0) {
            var sql = {
                id: id,
                pwd: encryptedPwd
            };
        var query = db.query('INSERT INTO users set ?', sql, function(err, rows) {
            if(err) {
                return console.log(err)
            } else {
                console.log("User ID [ " + id + " ] has been created successfully!");
                res.end()
            }
        })
        } else {
            console.log("errorcode: " + err);
            return res.sendStatus(500);  // error page number is 500 so I made like this
        }
    });
};

module.exports = { handleNewUser };
