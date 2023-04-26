//various requirements for website to work
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

//sets length of a session
const oneHour = 1000 * 60 * 60 * 1;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

//sets new port for REST API to run on
const PORT = process.env.PORT || 4000;

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10,
  port: process.env.DB_PORT,
  multipleStatements: true,
});

connection.getConnection((err) => {
  if (err) return console.log(err.message);
  console.log("connected to local mysql db using .env properties");
});

const server = app.listen(PORT, () => {
  console.log(`API started on port ${server.address().port}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  sessions({
    secret: "stacksofwax1234567",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);

//connects to db
let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cs7062project",
  port: "3306",
});

db.connect((err) => {
  if (err) throw err;
});


//default page to display all albums, exists more for programmer's sake, but can be used to see all albums on display if search is not wanted
app.get("/displayalbums", (req, res) => {
  let ep = `http://localhost:4000/albumoutput/ `;

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render("apialbuminfo", { titletext: "Albums", albumdata });
  });
});


//Web app of what is going on during rowid inspect 
app.get("/inspect", (req, res) => {
  let item_id = req.query.item;
  let endp = `http://localhost:4000/albumoutput/${item_id}`;

  axios.get(endp).then((response) => {
    // res.send(response.data);

    let albumdata = response.data;

    res.render("albuminfo", { albumdata });
  });
});

//General API query to output all albums
app.get("/albumoutput", (req, res) => {
  let allalbums = `SELECT * From album;`;

  db.query(allalbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//API  for allowing rowid, such as in the search, to be used as the query for a personalised display page
app.get("/albumoutput/:rowid", (req, res) => {
  let rowid = req.params.rowid;


  let getalbum = `SELECT album.album_title, album.artist, album.album_desc, album.year_of_release, genre.name, song.title, song.Time
  FROM album
  INNER JOIN genre
  ON album.genre_id = genre.genre_id
  INNER JOIN album_tracklist
  ON album.album_id = album_tracklist.album_id
  INNER JOIN song
  ON album_tracklist.song_id = song.song_id
  WHERE album.album_id = ${rowid}
  ORDER BY song.song_id`


  db.query(getalbum, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//displays web app to search for albums
app.get("/searchalbums", (req, res) => {

  let endpoint = `http://localhost:4000/genrelist`

  axios.get(endpoint).then((response) => {
    const genreinfo = response.data;
    res.render("searchalbums", { titletext: "Albums", genreinfo});
  });
  
});


//posts info submitted from webapp
app.post("/searchalbums", (req, res) => {
  let artist = req.body.artistField;
  let albumyear = req.body.albumyear;
  let genre = req.body.genretypes;

  const insertData = {
    artistField: artist,
    albumyear: albumyear,
    genretypes: genre,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/albumsearch";

  //axios posts the data, and then the response data is used for the output of the page
  axios.post(endpoint, insertData, config).then((response) => {
      let albumdata = response.data;
      console.log(albumdata);
      res.render("apialbuminfo", { titletext: "Albums", albumdata });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//api of album search basically checks what's been submitted and modifies the query based on that
app.post("/albumsearch", (req, res) => {
  let artist = req.body.artistField;
  let albumyear = req.body.albumyear;
  let genre = req.body.genretypes;

  console.log(artist);

  //paramiterisation, will be the array used for inserting data into db
  let insertdata = [];
  //base query to be read through, uses an inner join to get relevant data, joined on album and genre tables
  let searchquery = `SELECT album.album_id, album.album_title, album.artist, album.year_of_release, album.album_desc, genre.name 
  FROM album 
  INNER JOIN genre 
  ON album.genre_id = genre.genre_id`;

  // Adds the WHERE clause based on what it has been fed through the api. += allows it to dynamically resize and add search queries, by using WHERE and then adding AND it basically allows you to search for all those queries if they add
  if (artist || albumyear || (genre && genre !== "0")) {
    searchquery += ` WHERE `;

    //artist is detected to have anything in it, query expands
    if (artist) {
      searchquery += `album.artist = ?`;
      //pushes artist values into array on ever expanding array
      insertdata.push(artist);

      //looks if there has been any more data fed in 
      if (albumyear || (genre && genre !== "0")) {
        searchquery += ` AND `;
      }
    }
    
    //looks for album year, if detected adds to query again and pushes another value to array
    if (albumyear) {
      searchquery += `album.year_of_release = ?`;
      insertdata.push(albumyear);

      //checks for final possible value genre, if it exist adds an "AND"
      if (genre && genre !== "0") {
        searchquery += ` AND `;
      }
    }
    // genre
    if (genre && genre !== "0") {
      searchquery += `genre.genre_id = ?`;
      insertdata.push(genre);

    }

  
    
  }

  console.log(insertdata);
  //default orders them by descending values, allowing user to see most liked values
  searchquery += ` ORDER BY album.upvote_count DESC`

  //db query for the search
  db.query(searchquery, insertdata, (err, result) => {
    if (err) throw err;

    // Feeds the data back
    res.json({ data: result });
  });
});

//Displaying interface to add an album 
app.get("/addaalbum", (req, res) => {
  //session protection


  let sessionobj = req.session;

  if (sessionobj.authen) {

    let endpoint = `http://localhost:4000/genrelist`

    axios.get(endpoint).then((response) => {
      const genreinfo = response.data;
      res.render("addrecord", {message: "Make your addition to the Stack of Wax", genreinfo});
    });
  
} else {

  // if session authentication fails you are sent back to login
  res.redirect("/login");
}
});

//using axios to post albums to DB
app.post("/addaalbum", (req, res) => {

 

  
  //vars to be used
  let album = req.body.albumField;
  let artist = req.body.artistField;
  let albumyear = req.body.albumyear;
  let desc = req.body.descField;
  let genre = req.body.genretypes;

  //puts them in to one block to be used
  let insertData = {
    albumField: album,
    artistField: artist,
    albumyear: albumyear,
    descField: desc,
    genretypes: genre,
  };

  //sets it so that it is sent in this particular format, otherwise causes errors
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };


  //api route of where they are added
  let endpoint = "http://localhost:4000/albumoutput/add";

  //posts through axios, then gets the result back and returns it to the genreinfo
  axios.post(endpoint, insertData, config).then((response) => {
      let resmessage = response.data.respObj.message;

      let secondep = `http://localhost:4000/genrelist`

    axios.get(secondep).then((response) => {
      const genreinfo = response.data;
      res.render("addrecord", {message: `${resmessage}. Would you like to add another album?`, genreinfo});
    });
    }).catch((err) => {
      console.log(err.message);
    });

});

//API for adding album
app.post("/albumoutput/add", (req, res) => {
  let album = req.body.albumField;
  let artist = req.body.artistField;
  let album_desc = req.body.descField;
  let year_of_release = req.body.albumyear;
  let genre = req.body.genretypes;

  let addalbum = `INSERT INTO album (album_title, artist, year_of_release, album_desc, genre_id)  
                  VALUES (?, ?, ?, ?, ?)`;

//stores object as array, fixes issue with data not adding as expected     
  let insertdata = [album, artist, year_of_release, album_desc, genre];

  //db query to insert the data
  db.query(addalbum, insertdata, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      //the response message that will be sent back to the post once finished
      let respObj = {id: data.insertId, title: album, message: `${album} added to Stack of Wax`};
      res.json({ respObj });
    }
  });
});


//genre api for getting what's available. 
app.get("/genrelist", (req, res) => {

  //sql query to do this 
  let genresearch = `SELECT name, genre_id from genre`;

  db.query(genresearch, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});


//getting webapp to add song to albums, brings up list of albums so user can see what album they want to add their newly created song to
app.get("/addsong", (req, res) => {
  //
  axios.get("http://localhost:4000/albumoutput").then( (response) => {
    // gets data of data for the valid inputs to album output
      let albuminfo = response.data.data;
      res.render("addasong", {message: "Add your song to the Stack of Wax", albuminfo});
    })
      
});

//posting the web app version
app.post("/addsong", (req, res) => {
  let title = req.body.titleField;
  let time = req.body.timeField;
  let album = req.body.albumValue;

  //creates variable to be used
  let insertData = {
    titleField: title,
    timeField: time,
    albumValue: album,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  //end point for adding a song
  let endpoint = "http://localhost:4000/songoutput/add";

  axios.post(endpoint, insertData, config).then((response) => {
      let resmessage = response.data.respObj.message;

      // Get album info for rendering the page
      //asynchronous return again handled so it can render the page message when done with the user
      axios.get("http://localhost:4000/albumoutput").then((response) =>{
          let albuminfo = response.data.data;
          res.render("addasong", {message: `${resmessage}. Would you like to add another?`, albuminfo: albuminfo,});
        }).catch ((err)=>{
          console.log(err.message)
        });
  }).catch ((err)=>{
    console.log(err.message)
  });
});

//API of adding a song to an album
app.post("/songoutput/add", (req, res) => {
  let title = req.body.titleField;
  let time = req.body.timeField;
  let albumValue = req.body.albumValue;

  let addsong = `INSERT INTO song (title, time) VALUES (?, ?);`;
  //assigned to array to fix any unexpected issues with results.
  let songvalues = [title, time];

///db query to song values 
  db.query(addsong, songvalues, (err, result) => {
    if (err) {
      comsole.log( err );
      throw err;
    }

    //assigns song id to last inserted value in DB, works by relying on autoincrement of primary key
    let songId = result.insertId;

    //stuff is then inserted into album tracklist
    let addTracklist = `INSERT INTO album_tracklist (album_id, song_id) VALUES (?, ?);`;
    
    //again put into array to avoid any issues
    let tracklistValues = [albumValue, songId];

    db.query(addTracklist, tracklistValues, (err, result) => {
      if (err) {
        console.log( err );
        throw err;
      }

      let respObj = {id: songId, message: `${title} added to Stack of Wax`};
      res.json({ respObj });
    });
  });
});

// web app of adding song to album
app.get("/addsongtouseralbum", (req, res) => {

  // session protection
  let sessionobj = req.session;

  if (sessionobj.authen) {

 
//assigned to session as needed later
  userid = req.session.authen;
  let ep = `http://localhost:4000/songstouseralbums/${userid}`;


let checkuser = `SELECT * FROM user_album WHERE user_id = ${userid};`

 db.query(checkuser, (err, rows) => {
  if (err) throw err;
  let numRows = rows.length;

  if (numRows > 0) {
    axios.get(ep).then((response) => {
      const albumandsonginfo = response.data;
      res.render("addsongtouseralbum", {message: "Your albums", albumandsonginfo, userid});
    });
  } else {
    let userid = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";
    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];
      res.render("home", { userdata: firstrow, sysinfo: "You don't have any albums, make one and then try again"});
    });
  }
});
} else {
  res.redirect("/login");
}
});
// posting of adding song to album
app.post("/addsongtouseralbum", (req, res) => {
  let albumValue = req.body.albumValue;
  let songValue = req.body.songValue;

  console.log(req.body.albumValue);
  console.log(req.body.songValue);

  const insertData = {
    albumValue: albumValue,
    songValue: songValue,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  //end point for user album tracklist
  let endpoint = "http://localhost:4000/useralbumtracklist/add";

  axios.post(endpoint, insertData, config).then((response) => {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;

    }).catch((err) => {
      console.log(err.message);
    });

  let ep = `http://localhost:4000/songstouseralbums/ `;

  axios.get(ep).then((response) => {
    //decided to keep this one a redirect
    let albumandsonginfo = response.data;
    res.redirect("addsongtouseralbum");
  });
});

//sql query run to get the songs and albums, nothing shared between rows, 
app.get("/songstouseralbums", (req, res) => {
  let songtouseralbums = `SELECT user_album.user_album_id, user_album.custom_album_name, NULL AS song_id, NULL AS title
  FROM user_album
  UNION
  SELECT NULL AS album_id, NULL AS album_title, song.song_id, song.title
  FROM song;`;

  db.query(songtouseralbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//users the user id, from the authen, as the query
app.get("/songstouseralbums/:userId", (req, res) => {
  const userId = req.params.userId;

  let songtouseralbums = `SELECT user_album.user_album_id, user_album.custom_album_name, NULL AS song_id, NULL AS title
FROM user_album
WHERE user_album.user_id = ?
UNION
SELECT NULL AS album_id, NULL AS album_title, song.song_id, song.title
FROM song;`;

  db.query(songtouseralbums, [userId], (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//API for userablum tracklist being added to
app.post("/useralbumtracklist/add", (req, res) => {
  let album = req.body.albumValue;
  let song = req.body.songValue;

  let addtracklist = `INSERT INTO user_album_tracklist (user_album_id, song_id)  
                        VALUES(${album}, ${song}); `;

  db.query(addtracklist, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      let respObj = {id: data.insertId,message: `Your song and album have have been joined in the Stack of Wax`};
      res.json({ respObj });
    }
  });
});


//web app of search user albums
app.get("/searchuseralbums", (req, res) => {

  let endpoint = `http://localhost:4000/genrelist`

  axios.get(endpoint).then((response) => {
    const genreinfo = response.data;
    res.render("searchuseralbums", { titletext: "User Collections", genreinfo});
  });
  
});

//web app post of search user albums
app.post("/searchuseralbums", (req, res) => {
 
  let genre = req.body.genretypes;

  const insertData = {
    genretypes: genre,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/useralbumsearch";

  //axios posts the data, and then the response data is used for the output of the page
  axios.post(endpoint, insertData, config).then((response) => {
      let albumdata = response.data;
      console.log(albumdata);
      res.render("useralbumslist", { titletext: "User Collections", albumdata });
    })
    .catch((err) => {
      console.log(err.message);
    });
});



//API of user album search
app.post("/useralbumsearch", (req, res) => {
  let genre = req.body.genretypes;

  console.log(genre);

  //the default search ranks by upvote count, allowing the filtering by most liked as a default option
  let albumsearch = `SELECT user_album.user_album_id,user_album.upvote_count, user_album.custom_album_name, user_album.album_desc, genre.name, auth_user.first_name, auth_user.last_name 
  FROM user_album 
  INNER JOIN genre ON user_album.genre_id = genre.genre_id 
  INNER JOIN auth_user ON user_album.user_id = auth_user.user_id
  ORDER BY user_album.upvote_count DESC;`;

  //if a genre has been posted it searches by that id it changes, sorts by upvote count as well
  if (genre && genre !== "0") {
    albumsearch = `SELECT user_album.user_album_id,user_album.upvote_count, user_album.custom_album_name, user_album.album_desc, genre.name, auth_user.first_name, auth_user.last_name 
  FROM user_album 
  INNER JOIN genre ON user_album.genre_id = genre.genre_id 
  INNER JOIN auth_user ON user_album.user_id = auth_user.user_id 
  WHERE genre.genre_id = ${genre} 
  ORDER BY user_album.upvote_count DESC;`;
  }

  //DB query to return results
  db.query(albumsearch, (err, result) => {
    if (err) throw err;

   
    res.json({ data: result });
  });
});

//displaying user albums
app.get("/displayuseralbums", (req, res) => {
  let ep = `http://localhost:4000/useralbumoutput/ `;

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render("useralbumslist", { titletext: "Albums", albumdata });
  });
});

//display of user album row API output
app.get("/get", (req, res) => {
  let item_id = req.query.item;
  let endp = `http://localhost:4000/useralbumoutput/${item_id}`;

  axios.get(endp).then((response) => {

    let albumdata = response.data;

    res.render("useralbuminfo", { albumdata });
  });
});

//default api space of all user albums
app.get("/useralbumoutput", (req, res) => {
  let allalbums = `SELECT * From user_album;`;

  db.query(allalbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//api to get row id and store it as unique page for that album
app.get("/useralbumoutput/:rowid", (req, res) => {
  let rowid = req.params.rowid;


  let getuseralbum = `SELECT user_album.custom_album_name, auth_user.username, user_album.album_desc, user_album.upvote_count, genre.name, song.title, song.Time
  FROM user_album
  INNER JOIN genre
  ON user_album.genre_id = genre.genre_id
  INNER JOIN user_album_tracklist
  ON user_album.user_album_id = user_album_tracklist.user_album_id
  INNER JOIN song
  ON user_album_tracklist.song_id = song.song_id
  INNER JOIN auth_user
  ON user_album.user_id = auth_user.user_id
  WHERE user_album.user_album_id = ${rowid}
  GROUP BY song.song_id`

  //db query made with query
  db.query(getuseralbum, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});


//displays add user album
app.get("/addauseralbum", (req, res) => {
  //protection
  let sessionobj = req.session;

  if (sessionobj.authen) {
    let userId = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userId], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/useralbumoutput/`;
      let ep2 = `http://localhost:4000/genrelist/`;

      axios.get(ep).then((response) => {
          let albumavailable = response.data;

          axios.get(ep2).then((response2) => {
            let genreinfo = response2.data;

            res.render("adduserrecord", { message: "Make your own collection", albumavailable: albumavailable, genreinfo: genreinfo, user: firstrow});
          }).catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error");
          });
        }).catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error");
        });
    });
  } else {
    res.redirect("/login");
  }
});



//posting to useralbum
app.post("/addauseralbum", (req, res) => {
  let customName = req.body.albumField;
  let user = req.body.userid;
  let album_desc = req.body.descField;
  let genre = req.body.genretypes;

  const insertData = {
    albumField: customName,
    userid: user,
    descField: album_desc,
    genretypes: genre,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/useralbumoutput/add";

  let userquery = "SELECT * FROM auth_user WHERE user_id = ?";

  db.query(userquery, [user], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
      return;
    }

    //user id so info can be fed
    let firstrow = rows[0];

    axios.post(endpoint, insertData, config).then((response) => {
      let resmessage = response.data.respObj.message;

      let secondep = `http://localhost:4000/genrelist`

      // brings user back with message 
      axios.get(secondep).then((response) => {
        const genreinfo = response.data;
        res.render("adduserrecord", {message: `${resmessage}. Would you like to add another personal album?`, genreinfo, user: firstrow});
      });
    });
  });
});


//API for user album adding
app.post("/useralbumoutput/add", (req, res) => {
  let customName = req.body.albumField;
  let user = req.body.userid;
  let album_desc = req.body.descField;
  let genre = req.body.genretypes;

  let adduseralbum = `INSERT INTO user_album (custom_album_name, album_desc, genre_id, user_id) 
                      VALUES(?, ?, ?, ?); `;
  let uservalues = [customName, album_desc, genre, user];

  db.query(adduseralbum, uservalues, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      let respObj = {id: data.insertId,title: customName, message: `${customName} album added to Stack of Wax`};
      res.json({ respObj });
    }
  });
});

//renders web app to add review
app.get("/useralbumreview", (req, res) => {
  //protection
  let sessionobj = req.session;

  if (sessionobj.authen) {
    let userId = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userId], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/addtouseralbumreviewlist/`;

      axios.get(ep).then((response) => {
          let albumavailable = response.data;
          res.render("postuseralbumreview", {message: "Post your review", albumavailable, user: firstrow,});
        }).catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error");
        });
    });
  } else {
    res.redirect("/login");
  }
});



app.post("/useralbumreview", (req, res) => {
  let reviewcontent = req.body.descField;
  //stores your authen as a userID that is then fed to the API, allowing for it to be used
  let userid = req.body.userid;
  let album = req.body.albumValue;
  let vote = req.body.voteValue;

  console.log(req.body.descField);
  console.log(req.body.userid);
  console.log(req.body.albumValue);
  console.log(req.body.voteValue);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/addinguseralbumreview/";

 
//variable for data
let insertData = {
  descField: reviewcontent,
  userid: userid,
  albumValue: album,
  voteValue: vote,
};

// posts the data 
  axios.post(endpoint, insertData, config).then((response) => {
      let user = "SELECT * FROM auth_user WHERE user_id = ?";

      db.query(user, [userid], (err, row) => {
        let firstrow = row[0];

        let ep = `http://localhost:4000/addtouseralbumreviewlist/`;

        axios.get(ep).then((response) => {
            let albumavailable = response.data;
            let message = `Your review has been added`;
            res.render("postuseralbumreview", { message, albumavailable, user: firstrow });
          }).catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error");
          });
      });
    }).catch((err) => {
      console.log(err.message);
    });
});




//API of user album review post

app.post("/addinguseralbumreview", (req, res) => {
  let reviewcontent = req.body.descField;
  //stores your authen as a userID that is then fed to the API, allowing for it to be used
  let userid = req.body.userid;
  let album = req.body.albumValue;
  let vote = req.body.voteValue;
  

  let user_album_id = album;

  voteValue = parseInt(vote);

 

  let addreview = `INSERT INTO review (review_content, user_id) VALUES('${reviewcontent}', ${userid})`;

  //The vote either returns a negative or a positive to the album affected, if somehow you return a number outside of that it will throw an error as a json
  if (voteValue === 1) {
    addvote = `UPDATE user_album SET upvote_count = upvote_count + 1 WHERE user_album_id = ${album}`;
  } else if (voteValue === -1) {
    addvote = `UPDATE user_album SET upvote_count = upvote_count - 1 WHERE user_album_id = ${album}`;
  } else {
    console.log("Invalid vote value" );
  }

  //query for adding review
  db.query(addreview, (err, result) => {
    if (err) throw err;

    // Get the last inserted review id
    let review_id = result.insertId;

    //sql query
    let addtoUserAlbumTracklist = `INSERT INTO useralbum_review (user_album_id, review_id)  
    VALUES (${user_album_id}, ${review_id});`;

    //second query to add to the album review
    db.query(addtoUserAlbumTracklist, (err, result) => {
      if (err) throw err;

      res.json({ message: "Review added and user album reviewlist updated" });

      db.query(addvote, (err, result) => {
        if (err) {
          console.log(err);
          //in case vote query doesn't go through
          return res.json({ message: "Failed to add vote" });
        }
      });
    });
  });
});

//displaying review page and sql query to get all user albums, which are all available to review
app.get("/addtouseralbumreviewlist", (req, res) => {
  let songtoalbums = ` SELECT * FROM user_album;`;

  db.query(songtoalbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//web app interface to add review
app.get("/review", (req, res) => {
  //protection
  let sessionobj = req.session;


  if (sessionobj.authen) {
    let userId = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userId], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/addtoreviewlist/`;

      axios.get(ep).then((response) => {
          let albumavailable = response.data;
          res.render("postalbumreview", {message: "Albums", albumavailable, user: firstrow});
        }).catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error");
        });
    });
  } else {
    res.redirect("/login");
  }
});


//web app of posting 
app.post("/review", (req, res) => {
  let reviewcontent = req.body.descField;
  //stores your authen as a userID that is then fed to the API, allowing for it to be used
  let userid = req.body.userid;
  let album = req.body.albumValue;
  let vote = req.body.voteValue;

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/addingreview/";

//vars
  let insertData = {
    descField: reviewcontent,
    userid: userid,
    albumValue: album,
    voteValue: vote,
  };

  axios.post(endpoint, insertData, config).then((response) => {
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/addtoreviewlist/`;

      axios.get(ep).then((response) => {
          let albumavailable = response.data;
          let message = `Your review has been added`;
          res.render("postalbumreview", { message, albumavailable, user: firstrow });
        }).catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error");
        });
    });
  }).catch((err) => {
    console.log(err.message);
  });
});

//API of review post
app.post("/addingreview", (req, res) => {
  let reviewcontent = req.body.descField;
  //stores your authen as a userID that is then fed to the API, allowing for it to be used
  let userid = req.body.userid;
  let album = req.body.albumValue;
  let vote = req.body.voteValue;
  

//checking it is parsed correctly
  voteValue = parseInt(vote);

 
 

// voting queries
  let addreview = `INSERT INTO review (review_content, user_id) VALUES(?, ?)`;

  //paramaterised insert 
  let reviewdata = [reviewcontent, userid ];
  if (voteValue === 1) {
    addvote = `UPDATE album SET upvote_count = upvote_count + 1 WHERE album.album_id = ${album}`;
  } else if (voteValue === -1) {
    addvote = `UPDATE album SET upvote_count = upvote_count - 1 WHERE album.album_id = ${album}`;
  } else {
    return res.json({ message: "Invalid vote value" });
  }

  //query for adding review, fixes issue with apostrophe's breaking the insert
  //also somewhat protects against injection
  db.query(addreview, reviewdata, (err, result) => {
    if (err) throw err;

    // Get the last inserted review id
    let review_id = result.insertId;

    let addtoAlbumTracklist = `INSERT INTO album_review (album_id, review_id)  
    VALUES (${album}, ${review_id});`;

    //second query to add to the album review
    db.query(addtoAlbumTracklist, (err, result) => {
      if (err) throw err;

      res.json({ message: "Review added and album reviewlist updated" });

      db.query(addvote, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ message: "Failed to add vote" });
        }
      });
    });
  });
});

//displaying review page and sql query to get all albums, which are all available to review
app.get("/addtoreviewlist", (req, res) => {
  let songtoalbums = ` SELECT * FROM album;`;

  db.query(songtoalbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//db query to check for reviews of albums that you made
app.get("/reviewsofyourcollections", (req, res) => {
let reviewquery = `SELECT user_album.user_id, user_album.user_album_id, user_album.custom_album_name, review.review_id, review.review_content
FROM user_album 
INNER JOIN useralbum_review ON user_album.user_id = useralbum_review.user_album_id
INNER JOIN review review ON useralbum_review.review_id = review.review_id
WHERE user_album.user_id = ?`

db.query(reviewquery, (err, row) => {
  res.render("home", { userdata: firstrow, sysinfo: "Hope you are enjoying our collection!"})
});
});

//web page of it, uses user id which is taken from the authen
app.get("/inspectreviews", (req, res) => {
  let userid = req.query.userid;
  let endp = `http://localhost:4000/reviewsofuseralbum/${userid}`;

  axios.get(endp).then((response) => {
    // res.send(response.data);

    let reviewdata = response.data;

    res.render("reviewsofuseralbum", { reviewdata });
  });
});

//the api part
app.get("/reviewsofuseralbum/:userid", (req, res) => {
  let userid = req.params.userid;

  let getreviews= `SELECT review.review_content, review.review_id, auth_user.username, user_album.custom_album_name
  FROM useralbum_review
  INNER JOIN review ON useralbum_review.review_id = review.review_id
  INNER JOIN user_album ON useralbum_review.user_album_id = user_album.user_album_id
  INNER JOIN auth_user ON review.user_id = auth_user.user_id
  WHERE user_album.user_id = ${userid}`
  
  



  db.query(getreviews, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});


//Renders login page
app.get("/login", (req, res) => {
  res.render("login");
});

//web app for login Posts these values, your email and string to the DB where it checks them against its values, because of the salting being a promise this has to be an async, otherwise only a promise will be returned
// uses bcrypt
app.post("/login", async (req, res) => {
  try {
  let username = req.body.emailString;
  let userpassword = req.body.passwordString;

  
  let checkuser = "SELECT * FROM auth_user WHERE username = ?";

  db.query(checkuser, [username], async (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;

    
    //if all is in order then a session is made and set to user id, useful for security and queries later
    if (numRows > 0) {
      const validPass = await bcrypt.compare(userpassword, rows[0].password);
      if (validPass) {
        let sessionobj = req.session;
        sessionobj.authen = rows[0].user_id;
        res.redirect("/home");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
} catch(err) {
  console.log(err);

}
});

//Not locked off, if you want to get to certain parts of the website you need to register
app.get("/register", (req, res) => {
  res.render("register");
});

//Fill in the info and you are allowed in, once done you are redirected to log-in
app.post("/admin/register", async (req, res) => {
  try {
  let username = req.body.username;
  let userpassword = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let usertype = req.body.status;
  let age = req.body.age;
  let user_desc = req.body.userdescript;

  // used to store passwords, selected 10 as it seems reasonable high but not way too high as to slow me down, must await result otherwise promise and no result will return
  let password = await bcrypt.hash(userpassword, 10);

  console.log(password);

  let albumsql =
    "INSERT INTO auth_user (username, password, first_name, last_name, status, age, user_desc) VALUES( ? , ? , ? , ? , ?, ? , ?)";
  db.query(albumsql, [username, password, firstname, lastname, usertype, age, user_desc], (err, rows) => {
      if (err) throw err;
      res.redirect("/login");
    }
  );
  } catch(e) {
    console.log(e)
    res.status(500).send("Error in registering");
  }
});

//Home page, protected route.
app.get("/home", (req, res) => {
  let sessionobj = req.session;
  if (sessionobj.authen) {
    let userid = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];
      res.render("home", { userdata: firstrow, sysinfo: "Hope you are enjoying our collection!"})
    });
  } else {
    res.redirect("/login");
  }
});

//landing page of site
app.get("/", (req, res) => {
  res.render("index")
});




//just show port 3000 is up and running
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});
