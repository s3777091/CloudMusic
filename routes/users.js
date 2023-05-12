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
        id: rows[0].idx,
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
}

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

    } else {
      //Already have user
      return res.sendStatus(401);
    }

  });
});


router.get('/like', async function (req, res, next) {
  const id = req.query.id;
  try {

    const sqlQuery = `
SELECT
  SongLike.image AS image,
  SongLike.name AS name,
  SongLike.songurl As Link,
  SongLike.encodeid AS encodeid,
  SongLike.artist AS artist
FROM SongLike
WHERE SongLike.USER_IDX = ${id}
UNION ALL
SELECT
  AlbumLike.image AS image,
  AlbumLike.name AS name,
  'Album' As Link,
  AlbumLike.encodeid AS encodeid,
  AlbumLike.artist AS artist
FROM AlbumLike
WHERE AlbumLike.USER_IDX = ${id};`

    RunQuery(sqlQuery, function (data) {
      const response = {
        status: "success",
        data: data
      };
      res.status(200).json(response);
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.post('/songlike', async function (req, res, next) {
  const encodeid = req.body.encodeid;
  const image = req.body.image;
  const name = req.body.name;
  const artist = req.body.artist;
  const songurl = req.body.songurl;
  const user_idx = req.body.user_idx;
  var checkSql = `SELECT COUNT(*) AS count FROM SongLike WHERE encodeid = '${encodeid}' AND user_idx = '${user_idx}'`;

  RunQuery(checkSql, function (result) {
    if (result[0].count > 0) {
      const response = {
        status: "error",
        message: "Song already exists"
      };
      res.status(400).json(response);
    } else {
      var insertSql = `INSERT INTO SongLike (encodeid,image,name,artist,songurl,user_idx) values ('${encodeid}','${image}','${name}','${artist}','${songurl}','${user_idx}')`;
      RunQuery(insertSql, function () {
        const response = {
          status: "success"
        };
        res.status(200).json(response);
      });
    }
  });
})

router.post('/albumlike', async function (req, res, next) {
  const encodeid = req.body.encodeid;
  const image = req.body.image;
  const name = req.body.name;
  const artist = req.body.artist;
  const user_idx = req.body.user_idx;

  var checkSql = `SELECT COUNT(*) AS count FROM AlbumLike WHERE encodeid = '${encodeid}' AND user_idx = '${user_idx}'`;
  try {
    RunQuery(checkSql, function (result) {
      if (result[0].count > 0) {
        const response = {
          status: "fail",
          message: "Duplicate entry"
        };
        res.status(400).json(response);
      } else {
        var insertSql = `INSERT INTO AlbumLike (encodeid,image,name,artist,user_idx) VALUES ('${encodeid}','${image}','${name}','${artist}','${user_idx}')`;
        RunQuery(insertSql, function () {
          const response = {
            status: "success"
          };
          res.status(200).json(response);
        });
      }
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get('/count', async function (req, res, next) {
  const user_idx = req.query.id;

  var sql = `SELECT type, COUNT(*) AS count FROM (
    SELECT 'AlbumLike' AS type, user_idx FROM AlbumLike
    UNION ALL
    SELECT 'SongLike' AS type, user_idx FROM SongLike
) t
WHERE user_idx = '${user_idx}'
GROUP BY type;`

  try {
  
    RunQuery(sql, function (result) {

      const response = {
        status: "success",
        album: result[0].count,
        song: result[1].count
      };
      res.status(200).json(response);


    });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


module.exports = router;