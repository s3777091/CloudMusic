var express = require('express');
var router = express.Router();

require("dotenv").config();
var axios = require('axios');


const security = require("../config/security");
var homeLink = security.GetHome;
var playList = security.GetPaylist;
var searchSongs = security.SearchSongs;

async function getData(url, callback) {
  try {
    const response = await axios.get(url);
    const music = await axios({
      method: 'get',
      url: url,
      headers: {
        Accept: "application/json",
        cookie: `${response.headers['set-cookie'][0]};zpsid=${process.env.ZPSID};zmp3_sid=${process.env.SID}`
      }
    });

    callback(music.data);
  } catch (error) {
    console.error(error);
  }
}


async function GetMusicPage(page, callback) {
  var playList = [];


  homeLink(page, async function (link) {

    await getData(link, async function (data) {
      const listMusic = data.data.items;

      for (let i in listMusic) {
        const ms = listMusic[i];
        
        if (ms.sectionType == 'playlist') {
          playList.push({
            "tilte": ms.title,
            "playlist": ms.items
          });
        }
        if (ms.sectionType == 'new-release') {
          playList.push({
            "tilte": ms.title,
            "playlist": ms.items
          });

        }
      }

    });


    callback(playList);
  });
}

/* GET home page. defauls is 1*/
router.get('/', function (req, res, next) {
  try {
    GetMusicPage("1", async function (data) {
      const response = {
        status: "success",
        playListHome: data
      };
      res.status(200).json(response);
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get('/page', function (req, res, next) {
  try {
    const page = req.query.page;
    GetMusicPage(page, async function (data) {
      const response = {
        status: "success",
        page: page,
        playListHome: data
      };
      res.status(200).json(response);
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


router.get('/playlist', function (req, res, next) {
  try {
    const id = req.query.id;
    playList(id, async function (url) {
      await getData(url, async function (data) {
        const response = {
          value: id,
          mp3_link: url,
          mp3_data: data
        };
          
        res.status(200).json(response);
      });
  
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// search routers

router.get('/search/songs', function (req, res, next) {
  try {
    const query = req.query.q;
    searchSongs(query, async function (url) {
      await getData(url, async function (data) {
        const response = {
          mp3_link: url,
          mp3_data: data
        };
        console.log(response);
          
        res.status(200).json(response);
      });
  
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});




module.exports = router;