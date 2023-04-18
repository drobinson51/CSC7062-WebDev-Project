


require('dotenv').config();
const express = require("express");
const axios = require("axios");
const app = express();
const mysql = require("mysql");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const oneHour = 1000 * 60 * 60 * 1;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));


const PORT = process.env.PORT || 4000;

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:10,
    port:process.env.DB_PORT,
    multipleStatements: true
});

connection.getConnection((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db using .env properties");
});







app.get('/addalbum', (req, res)=> { 

  let ep = "http://localhost:4000/albumoutput/"

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render('addalbum', {titletext: 'Albums', albumdata});
  });





});


app.get('/inspect', (req, res)=> {  
  let ep = `http://localhost:4000/albumoutput/ `;

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render('apialbuminfo', {titletext: 'Albums', albumdata});
  });

  });

app.get('/albumoutput', (req, res)=> { 
  let allalbums = `SELECT album.album_id, album.album_title, album.artist, album.year_of_release, album.album_desc, genre.name
  FROM album
  INNER JOIN genre
  ON album.genre_id = genre.genre_id;`
;

  db.query(allalbums, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});


app.get('/albumoutput/:rowid', (req, res)=> { 
    let rowid = req.params.rowid;
    // let getalbum = `Select * FROM album WHERE album_id = ${rowid}`;

  let getalbum = `SELECT album.album_id, album.album_title, album.artist, album.year_of_release, album.album_desc, genre.name
  FROM album
  INNER JOIN genre
  ON album.genre_id = genre.genre_id
  WHERE
  album.album_id = ${rowid};`

    
    db.query(getalbum, (err, data) => {
      if (err) throw err;
      res.json({data});
    });

});

app.post('/albumoutput/add', (req, res)=> { 

  let album = req.body.albumField;
  let artist = req.body.artistField;
  let album_desc = req.body.descField;
  let year_of_release = req.body.albumyear
  let genre = req.body.genretypes;



  let addalbum = `INSERT INTO album (album_title, artist, album_desc, year_of_release, genre_id) 
                  VALUES('${album}', '${artist}', '${album_desc}', ${year_of_release}, ${genre}); `;

  db.query(addalbum, (err, data) => {  
      if(err) {
          res.json({err});
          throw err;
      }

      if(data){
          let respObj ={
              id: data.insertId,
              title: album,
              message: `${album} album added to Stack of Wax`,
          };
          res.json({respObj});
      }
      
  });
});


const server = app.listen(PORT, () => {
    console.log(`API started on port ${server.address().port}`);
});


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use( sessions({
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




//Log in 
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  let username = req.body.emailString;
  let userpassword = req.body.passwordString;

  let checkuser = "SELECT * FROM auth_user WHERE username = ? AND password = ?";

  db.query(checkuser, [username, userpassword], (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;

    if (numRows > 0) {
      let sessionobj = req.session;
      sessionobj.authen = rows[0].user_id;
      res.redirect('/home');
    } else {
      res.redirect('/')
    }
  });
});


app.get('/home', (req,res) => {
  let sessionobj = req.session;
  if(sessionobj.authen){
    let userid = sessionobj.authen;
    let user = "SELECT * FROM auth_user WHERE user_id = ?";

    db.query(user, [userid], (err, row) => {
      let firstrow = row[0];
      res.render('home', {userdata:firstrow});
    });
      
  }else{
      res.send("Access has been denied");
  } 
});

app.get('/admin/add', (req, res) => {
  res.render("addrecord");
});

app.post('/admin/add', (req, res) => {
    let albumname = req.body.albumField;
    let artistname = req.body.artistField;
    let albumdesc = req.body.descField;
    // let albumdesc = "Troubleshooting as we speak";
    let releaseyear = req.body.albumyear;
    let genre = req.body.genretypes;

    if (genre === 'Nu Metal') {
      genre = 1;
    } else if (genre === 'Rock n Roll') {
      genre = 2;
    }
    
    let albumsql = "INSERT INTO album (album_title, artist, album_desc, year_of_release, genre_id) VALUES( ? , ? , ? , ? , ?)";
    db.query(albumsql,[albumname, artistname, albumdesc, releaseyear, genre],(err, rows)=>{
      if(err) throw err;
      res.send(`You have added: <p>${albumname}</p> <p>${artistname}</p> <p>${albumdesc}</p> <p>${releaseyear}</p> <p>${genre}</p>` );
  });
});


app.get('/album', (req, res) => {
    let readsql = "SELECT * FROM album"
    db.query(readsql, (err, rows) => {
      if (err) throw err;
      // let stringdata = JSON.stringify(rows);
      let rowdata = rows;
      // res.send(`<h2>My Albums</h2><code> ${stringdata} </code>`);
      res.render('album', {title: 'List of albums', rowdata});
    });
});

app.get('/albuminfo', (req, res) => {
  let readsql = "SELECT * FROM album"
  db.query(readsql, (err, rows) => {
    if (err) throw err;
    // let stringdata = JSON.stringify(rows);
    let rowdata = rows;
    // res.send(`<h2>My Albums</h2><code> ${stringdata} </code>`);
    res.render('albuminfo', {title: 'List of albums', rowdata});
  });
});

app.get("/row",(req,res) => {
    let albumid = req.query.albumid;

    let readsql = "SELECT * FROM album WHERE album_id = ?";
    
    db.query(readsql, [albumid], (err, rows)=>{
        if(err) throw err;

        if (rows[0]['genre_id'] === 1) {
          rows[0]['genre_id'] = "Nu Metal"
        }
        let album = {
          album_title: rows[0]['album_title'],
          artist: rows[0]['artist'],
          album_desc: rows[0]['album_desc'],
          year_of_release: rows[0]['year_of_release'],
          genre: rows[0]['genre_id'],
          
          
        };
        

        res.render('albuminfo', {album});
    });
});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000");
});




