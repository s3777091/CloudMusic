var express = require('express');
var router = express.Router();

require("dotenv").config();
var axios = require('axios');


const security = require("../config/security");
const e = require('express');



var homeLink = security.GetHome;
var playList = security.GetPaylist;
var NewConcept = security.GetNewConcept;
var VideoLink = security.GetVideo;
var AlbumLink = security.getAlbum;
var StreamLink = security.getStream;
var LyrickLink = security.getLyrick;
var HubLink = security.GetHub;
var HubDetailLink = security.getHubDetail;
var ArtistLink = security.GetArtist;
var SearchLink = security.GetSearch;



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
        if (ms.sectionType == 'banner') {
          playList.push({
            "tilte": ms.title,
            "type": ms.sectionType,
            "playlist": ms.items
          });
        }

        if (ms.sectionType == 'livestream') {
          playList.push({
            "tilte": ms.title,
            "type": ms.sectionType,
            "playlist": ms.items
          });
        }

        if (ms.sectionType == 'playlist') {
          playList.push({
            "tilte": ms.title,
            "type": ms.sectionType,
            "playlist": ms.items
          });
        }
        if (ms.sectionType == 'new-release') {
          playList.push({
            "tilte": ms.title,
            "type": ms.sectionType,
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


async function getVideo(id, callback) {

  try {
    VideoLink(id, async function (url) {
      await getData(url, async function (data) {
        const videoData = data.data;
        playList.push(videoData);

      });
      callback(playList);
    })



  } catch (error) {
    console.error(error);
  }
}

router.get('/new', function (req, res, next) {
  try {
    const type = req.query.type;

    var Data = [];

    NewConcept(type, async function (link) {
      await getData(link, async function (data) {
        const listMusic = data.data;
        for (let h in listMusic) {
          const ne = listMusic[h];
          if (!ne?.mvlink) {
            Data.push({
              title: ne.title,
              thumbnail: ne.thumbnail,
              thumbnailM: ne.thumbnailM,
              encodeId: ne.encodeId,
              artistsNames: ne.artistsNames,
              video: '',
              hasVideo: false,
            })
          } else {
            Data.push({
              title: ne.title,
              thumbnail: ne.thumbnail,
              thumbnailM: ne.thumbnailM,
              encodeId: ne.encodeId,
              artistsNames: ne.artistsNames,
              video: '',
              hasVideo: true,
            })
          }
        }

        const response = {
          status: "success",
          playListHome: Data
        };
        res.status(200).json(response);
      });
    });

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



router.get('/mp3', function (req, res, next) {
  try {
    const code = req.query.id;
    StreamLink(code, async function (link) {
      // console.log(link);
      await getData(link, async function (data) {
        const mp3 = data.data;

        const response = {
          mp3_128: mp3['128'] || "",
          mp3_320: mp3['320'] || "",
          mp3_lossless: mp3.lossless || ""
        };
        res.status(200).json(response);
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get('/lyrick', function (req, res, next) {
  try {
    const code = req.query.id;
    LyrickLink(code, async function (link) {
      // console.log(link);
      await getData(link, async function (data) {
        const lyrick = data.data;
        const response = {
          sentences: lyrick.sentences,
        };
        res.status(200).json(response);
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


async function getAlbum(listSong) {
  try {
    var Song = [];
    for (let h in listSong.items) {
      const net = listSong.items[h];
      Song.push({
        id: net.encodeId,
        artwork: net.thumbnailM,
        title: net.title,
        artist: net.artistsNames,
        duration: net.duration,
      })
    }
    return Song;
  } catch (error) {
    console.error(error);
  }
}


// ZOCIIUWW
router.get('/album', function (req, res, next) {
  try {
    const encode = req.query.id;


    AlbumLink(encode, async function (link) {
      // console.log(link);
      await getData(link, async function (data) {
        const album = data.data;
        const response = {
          status: "success",
          title: album.title,
          encodeId: album.encodeId,
          thumbnail: album.thumbnail,
          thumbnailM: album.thumbnailM,
          genres: album.genres,
          artists: album.artists,
          artistsNames: album.artistsNames,
          releaseDate: album.releaseDate,
          description: album.description,
          song: await getAlbum(album.song)
        };
        res.status(200).json(response);
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// ZOCIIUWW
router.get('/artist', function (req, res, next) {
  try {

    var Data = [];
    const alias = req.query.alias;
    ArtistLink(alias, async function (link) {
      await getData(link, async function (data) {

        const art = data.data;
        for (let h in art.sections) {
          const ne = art.sections[h];
          if (ne.sectionType == 'song') {
            Data.push({
              type: ne.sectionType,
              title: ne.title,
              song: ne.items
            })
          }

          if (ne.sectionType == 'playlist') {
            Data.push({
              type: ne.sectionType,
              title: ne.title,
              items: ne.items
            })
          }

          if (ne.sectionType == 'artist') {
            Data.push({
              type: ne.sectionType,
              title: ne.title,
              items: ne.items
            })
          }

        }

        const response = {
          status: "success",
          name: art.name,
          cover: art.cover,
          thumbnail: art.thumbnailM,
          sortBiography: art.sortBiography,
          totalFollow: art.totalFollow,
          follow: art.follow,
          sections: Data
        };
        res.status(200).json(response);
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


router.get('/hub', function (req, res, next) {
  try {
    HubLink(async function (link) {
      await getData(link, async function (data) {
        const hub = data.data;
        const response = {
          status: "success",
          banner: hub.banners,
          featured: hub.featured,
          topTopic: hub.topTopic,
          topic: hub.topic,
          nations: hub.nations,
          genre: hub.genre
        };
        res.status(200).json(response);

      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get('/hub/detail', function (req, res, next) {
  try {
    const id = req.query.id;
    HubDetailLink(id, async function (link) {
      await getData(link, async function (data) {
        const HubDetail = data.data;
        const response = {
          status: "success",
          playList: HubDetail.sections[0].items
        };
        res.status(200).json(response);

      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});



router.get('/search', function (req, res, next) {
  try {
    const key = req.query.key;
    SearchLink(key, async function (link) {
      await getData(link, async function (data) {
        const ts = data.data;
        const response = {
          status: "success",
          songs: ts.songs || 0,
          playlists: ts.playlists || 0,
          artists: ts.artists || 0
        };
        res.status(200).json(response);

      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});



module.exports = router;