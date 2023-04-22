require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const mysql = require("mysql");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const oneHour = 1000 * 60 * 60 * 1;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

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

app.get("/addalbum", (req, res) => {
  let ep = "http://localhost:4000/albumoutput/";

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render("addalbum", { titletext: "Albums", albumdata });
  });
});

app.get("/displayalbums", (req, res) => {
  let ep = `http://localhost:4000/albumoutput/ `;

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render("apialbuminfo", { titletext: "Albums", albumdata });
  });
});

//row id of API output

app.get("/inspectalbums", (req, res) => {
  let item_id = req.query.item;
  let endp = `http://localhost:4000/albumoutput/${item_id}`;

  axios.get(endp).then((response) => {
    // res.send(response.data);

    let albumdata = response.data;

    res.render("albuminfo", { albumdata });
  });
});

app.get("/albumoutput", (req, res) => {
  let allalbums = `SELECT * From album;`;

  db.query(allalbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

app.get("/albumoutput/:rowid", (req, res) => {
  let rowid = req.params.rowid;

  let getalbum = `SELECT album.album_title, album.artist, album.album_desc, album.year_of_release, genre.name, GROUP_CONCAT(song.title SEPARATOR ' ') AS songtitle
  FROM album
  INNER JOIN genre
  ON album.genre_id = genre.genre_id
  INNER JOIN album_tracklist
  ON album.album_id = album_tracklist.album_id
  INNER JOIN song
  ON album_tracklist.song_id = song.song_id
  WHERE album.album_id = ${rowid}
  GROUP BY album.album_id;`;

  db.query(getalbum, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//Displaying interface to add an album album
app.get("/addaalbum", (req, res) => {
  res.render("addrecord", {
    message: "Make your addition to the Stack of Wax",
  });
});

//using axios to post al
app.post("/addaalbum", (req, res) => {
  let album = req.body.albumField;
  let artist = req.body.artistField;
  let albumyear = req.body.albumyear;
  let desc = req.body.descField;
  let genre = req.body.genretypes;

  const insertData = {
    albumField: album,
    artistField: artist,
    albumyear: albumyear,
    descField: desc,
    genretypes: genre,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/albumoutput/add";

  axios
    .post(endpoint, insertData, config)
    .then((response) => {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;

      // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

      // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      res.render("addrecord", {
        message: `${resmessage}. Would you like to add another?`,
      });
    })
    .catch((err) => {
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
                  VALUES('${album}', '${artist}', ${year_of_release}, '${album_desc}', ${genre} ); `;

  db.query(addalbum, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      let respObj = {
        id: data.insertId,
        title: album,
        message: `${album} album added to Stack of Wax`,
      };
      res.json({ respObj });
    }
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

app.get("/inspectuseralbums", (req, res) => {
  let item_id = req.query.item;
  let endp = `http://localhost:4000/useralbumoutput/${item_id}`;

  axios.get(endp).then((response) => {
    // res.send(response.data);

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

  let getuseralbum = `SELECT user_album.custom_album_name, auth_user.first_name, auth_user.last_name, user_album.album_desc, genre.name, GROUP_CONCAT(song.title SEPARATOR ' ') AS songtitle
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
  GROUP BY user_album.user_album_id;`;

  db.query(getuseralbum, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});


//Displaying interface to add an album album
app.get("/addauseralbum", (req, res) => {
  //protection
  let sessionobj = req.session;

  if (sessionobj.authen) {
    let userId = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userId], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/useralbumoutput/`;

      axios
        .get(ep)
        .then((response) => {
          let albumavailable = response.data;
          res.render("adduserrecord", {
            message: "Albums",
            albumavailable,
            user: firstrow,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error");
        });
    });
  } else {
    res.redirect("/");
  }
});

//using axios to post al
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

  axios
    .post(endpoint, insertData, config)
    .then((response) => {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;

      // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

      // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      res.render("addrecord", {
        message: `${resmessage}. Would you like to add another?`,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});



//API for user album adding
app.post("/useralbumoutput/add", (req, res) => {
  let customName = req.body.albumField;
  let user = req.body.userid;
  let album_desc = req.body.descField;
  let genre = req.body.genretypes;

  let adduseralbum = `INSERT INTO user_album (custom_album_name, album_desc, genre_id, user_id) 
                  VALUES('${customName}', '${album_desc}', ${genre}, ${user} ); `;

  db.query(adduseralbum, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      let respObj = {
        id: data.insertId,
        title: customName,
        message: `${customName} album added to Stack of Wax`,
      };
      res.json({ respObj });
    }
  });
});



//Posting song to albums
app.get("/addsong", (req, res) => {
  res.render("addasong", { message: "Add your song to the Stack of Wax" });
});

//Posts song through axios on the web app
app.post("/addsong", (req, res) => {
  let title = req.body.titleField;
  let time = req.body.timeField;

  const insertData = {
    titleField: title,
    timeField: time,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/songoutput/add";

  axios
    .post(endpoint, insertData, config)
    .then((response) => {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;

      // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

      // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      res.render("addasong", {
        message: `${resmessage}. Would you like to add another?`,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//adding a song to Stack of Wax, the API route
app.post("/songoutput/add", (req, res) => {
  let title = req.body.titleField;
  let time = req.body.timeField;

  let addsong = `INSERT INTO song (title, time)  
                  VALUES('${title}', '${time}'); `;

  db.query(addsong, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      let respObj = {
        id: data.insertId,
        message: `${title} added to Stack of Wax`,
      };
      res.json({ respObj });
    }
  });
});

//gets song amd albums, uses for each loop to display them in select
app.get("/addsongtoalbum", (req, res) => {
  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.render("addsongtoalbum", { message: "Albums", albumandsonginfo });
  });
});

//sql query run to get the songs and albums, nothing shared between rows, ergo 1=1 to ensure join
app.get("/songstoalbums", (req, res) => {
  // let songtoalbums = `SELECT album.album_id, album.album_title, song.song_id, song.title
  // FROM album
  // INNER JOIN song
  // WHERE 1 = 1;`

  let songtoalbums = ` SELECT album.album_id, album.album_title, NULL AS song_id, NULL AS title
  FROM album
  UNION
  SELECT NULL AS album_id, NULL AS album_title, song.song_id, song.title
  FROM song;`;

  db.query(songtoalbums, (err, data) => {
    if (err) throw err;
    res.json({ data });
  });
});

//web page to link song to album.
app.post("/addsongtoalbum", (req, res) => {
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

  let endpoint = "http://localhost:4000/albumtracklist/add";

  axios
    .post(endpoint, insertData, config)
    .then((response) => {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;

      // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

      // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      // res.redirect('addsongtoalbum', {message: 'Your song and album have been joined in the Stack of Wax, would you like to add another?', albumandsonginfo})
    })
    .catch((err) => {
      console.log(err.message);
    });

  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.redirect("addsongtoalbum");
  });
});

//API route to link album and song together. Redirects back to page to add another.
app.post("/albumtracklist/add", (req, res) => {
  let album = req.body.albumValue;
  let song = req.body.songValue;

  let addtracklist = `INSERT INTO album_tracklist (album_id, song_id)  
                        VALUES(${album}, ${song}); `;

  db.query(addtracklist, (err, data) => {
    if (err) {
      res.json({ err });
      throw err;
    }

    if (data) {
      let respObj = {
        id: data.insertId,
        message: `Your song and album have have been joined in the Stack of Wax`,
      };
      res.json({ respObj });
    }
  });
});

app.post("/addsongtoalbum", (req, res) => {
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

  let endpoint = "http://localhost:4000/albumtracklist/add";

  axios
    .post(endpoint, insertData, config)
    .then((response) => {
      let insertedid = response.data.respObj.id;
      let resmessage = response.data.respObj.message;

      // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);

      // res.render('addrecord', { message: `${resmessage}. INSERTED DB id ${insertedid}` });
      // res.redirect('addsongtoalbum', {message: 'Your song and album have been joined in the Stack of Wax, would you like to add another?', albumandsonginfo})
    })
    .catch((err) => {
      console.log(err.message);
    });

  let ep = `http://localhost:4000/songstoalbums/ `;

  axios.get(ep).then((response) => {
    let albumandsonginfo = response.data;
    res.redirect("addsongtoalbum");
  });
});

//renders interface to add review
app.get("/review", (req, res) => {
  //protection
  let sessionobj = req.session;

  if (sessionobj.authen) {
    let userId = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userId], (err, row) => {
      let firstrow = row[0];

      let ep = `http://localhost:4000/addtoreviewlist/`;

      axios
        .get(ep)
        .then((response) => {
          let albumavailable = response.data;
          res.render("postalbumreview", {
            message: "Albums",
            albumavailable,
            user: firstrow,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Internal server error");
        });
    });
  } else {
    res.redirect("/");
  }
});

//Posts song through axios on the web app
app.post("/review", (req, res) => {
  let reviewcontent = req.body.descField;
  //stores your authen as a userID that is then fed to the API, allowing for it to be used
  let userid = req.body.userid;
  let album = req.body.albumValue;

  console.log(req.body.descField);
  console.log(req.body.userid);
  console.log(req.body.albumValue);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  };

  let endpoint = "http://localhost:4000/addingreview/";

  let insertData = `descField=${reviewcontent}&userid=${userid}&albumValue=${album}`;

  axios
    .post(endpoint, insertData, config)
    .then((response) => {
      // console.log(response.data);
      // console.log(response.data.respObj.message);
      // let insertedid = response.data.data.insertId;
      // let resmessage = response.data.respObj.message;

      // res.send(`${resmessage}. INSERTED DB id ${insertedid}`);
      res.redirect("/review");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//API of review post
app.post("/addingreview", (req, res) => {
  let reviewcontent = req.body.descField;
  let userid = req.body.userid;
  let album_id = req.body.albumValue;

  console.log(reviewcontent, userid);

  let addreview = `INSERT INTO review (review_content, user_id) VALUES('${reviewcontent}', ${userid})`;

  //query for adding review
  db.query(addreview, (err, result) => {
    if (err) throw err;

    // Get the last inserted review id
    let review_id = result.insertId;

    
    let addtoAlbumTracklist = `INSERT INTO album_review (album_id, review_id)  
    VALUES (${album_id}, ${review_id});`;

    //second query to add to the album review
    db.query(addtoAlbumTracklist, (err, result) => {
      if (err) throw err;

      res.json({ message: "Review added and album reviewlist updated" });
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

//Renders login page
app.get("/", (req, res) => {
  res.render("login");
});

//Posts these values, your email and string to the DB where it checks them against its values
app.post("/", (req, res) => {
  let username = req.body.emailString;
  let userpassword = req.body.passwordString;

  let checkuser = "SELECT * FROM auth_user WHERE username = ? AND password = ?";

  db.query(checkuser, [username, userpassword], (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;

    //if all is in order then a session is made and set to user id, useful for security and queries later
    if (numRows > 0) {
      let sessionobj = req.session;
      sessionobj.authen = rows[0].user_id;
      res.redirect("/home");
    } else {
      res.redirect("/");
    }
  });
});

//Not locked off, if you want to get to certain parts of the website you need to register
app.get("/register", (req, res) => {
  res.render("register");
});

//Fill in the info and you are allowed in, once done you are redirected to log-in
app.post("/admin/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let usertype = req.body.status;

  let albumsql =
    "INSERT INTO auth_user (username, password, first_name, last_name, status) VALUES( ? , ? , ? , ? , ?)";
  db.query(
    albumsql,
    [username, password, firstname, lastname, usertype],
    (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

//Home page, protected route.
app.get("/home", (req, res) => {
  let sessionobj = req.session;
  if (sessionobj.authen) {
    let userid = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];
      res.render("home", { userdata: firstrow });
    });
  } else {
    res.send("Access has been denied");
  }
});

// Checking that session was working correctly if asked for
app.get("/session", (req, res) => {
  console.log(req.session); // print out the session object
  res.send("Session information printed to console"); // send a response back to the client
});

//just show port 3000 is up and running
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});
