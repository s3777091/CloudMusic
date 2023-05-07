// database connection
const db = require("../module/db");
const bcrypt = require('bcrypt');


const handleLogin = async (req, res) => {
    const id = req.body.user_id;
    const pwd = req.body.user_pwd;
    const encryptedPwd = await bcrypt.hash(pwd, 10);
    
    var sql = "SELECT * FROM users  WHERE id = ?";
    
    db.query(sql, id, function (err, result) {
        var resultCode = 404;
        var message = 'Error';

        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 404;
                message = 'There is no account!';
            } else if (encryptedPwd !== result[0].pw) {
                resultCode = 404;
                message = 'Wrong Password!';
            } else {
                resultCode = 200;  // we don't have the success result code so I just assigned 200
                message = 'Successfully Logged in!';
            }
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    });
};

module.exports = { handleLogin };
