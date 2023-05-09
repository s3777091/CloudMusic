var express = require('express');
var router = express.Router();


const crypto = require('crypto');

var database = require("../module/db");
var RunQuery = database.RunQuery;



router.post('/login', async function (req, res, next) {

  const email = req.body.email;
  const pwd = req.body.pwd;

  const password = crypto.createHash('sha256').update(pwd).digest('hex')
  var sqlCheckId = `SELECT * FROM Users WHERE Email = '${email}'`;
  RunQuery(sqlCheckId, function (rows) {

    if (rows.length === 0) {
      //Null User
      return res.sendStatus(401);
    }

    if (rows[0].Password != password) {
      //Wrong password
      return res.sendStatus(407);
    } else {
      const response = {
        status: "success",
        name: rows[0].fullName,
        Email: rows[0].Email,
        Avatar: rows[0].Avatar,
        isActive: rows[0].isActive,
        isLogin: rows[0].isLogin
      };
      res.status(200).json(response);
    }
  });
});

const addUser = async (name, pwd, email) => {
  const password = crypto.createHash('sha256').update(pwd).digest('hex')
  var Sql = `
  INSERT INTO Users (fullName, Email, Password, Avatar, isActive, isLogin) VALUES ('${name}', '${email}', '${password}', 'https://i.ibb.co/whbkPKw/0ddccae723d85a703b798a5e682c23c1.png', 1, 0)`;
  RunQuery(Sql, function () {
    
  });
};

const getSongLike = async (id) => {
  var Sql = `select * from SongLike where USER_IDX = ${id}`;
  RunQuery(Sql, function(rows){
    return rows;
  });
};

const getAlbumLike = async (id) => {
  var Sql = `select * from AlbumLike where USER_IDX = ${id}`;
  RunQuery(Sql, function(rows){
    return rows;
  });
};

router.post('/register', async function (req, res, next) {
  const name = req.body.name;
  const pwd = req.body.pwd;
  const email = req.body.email;

  var sqlCheckId = `SELECT * FROM Users WHERE fullName = '${name}' || Email = '${email}'`;
  RunQuery(sqlCheckId, function (rows) {
    if (rows.length === 0) {
        addUser(name, pwd, email);
        const response = {
          status: "success",
          success: true
        }; 
        res.status(200).json(response);
      
    }  else {
      //Already have user
      return res.sendStatus(401);
    }

  });
});

router.get('/songlike', async function (){
  const id = req.query.id;
  try {
    getSongLike(id);
    const response = {
      status: "success",
      success: true
    }; 
    res.status(200).json(response);
  }
  catch (err){
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get('/albumlike', async function (){
  const id = req.query.id;
  try {
    getAlbumLike(id);
    const response = {
      status: "success",
      success: true
    }; 
    res.status(200).json(response);
  }
  catch (err){
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


module.exports = router;
