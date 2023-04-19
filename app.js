


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


app.get('/display', (req, res)=> {  
  let ep = `http://localhost:4000/albumoutput/ `;

  axios.get(ep).then((response) => {
    let albumdata = response.data;
    res.render('apialbuminfo', {titletext: 'Albums', albumdata});
  });

  });

  

//row id of API output

app.get('/inspect', (req, res)=> { 

    let item_id = req.query.item;
    let endp = `http://localhost:4000/albumoutput/${item_id}`;

      
      axios.get(endp).then((response)=>{
          // res.send(response.data);

          let albumdata = response.data;

          res.render('albuminfo', {titletext: 'Albums', albumdata});
    
  
  });

});
  


app.get('/albumoutput', (req, res)=> { 
  let allalbums = `SELECT * From album;`

//   let allalbums = `SELECT album.album_id, album.album_title, album.artist, album.album_desc, album.year_of_release, song.title, genre.name
//   FROM album
//   INNER JOIN genre
//   ON album.genre_id = genre.genre_id
//   INNER JOIN album_tracklist
//   ON album.album_id = album_tracklist.album_id
//  INNER JOIN song
//   ON album_tracklist.song_id = song.song_id;`



  db.query(allalbums, (err, data) => {
    if (err) throw err;
    res.json({data});
  });

});


app.get('/albumoutput/:rowid', (req, res)=> { 
    let rowid = req.params.rowid;
    // let getalbum = `Select * FROM album WHERE album_id = ${rowid}`;

  // let getalbum = `SELECT album.album_id, album.album_title, album.artist, album.year_of_release, album.album_desc, genre.name
  // FROM album
  // INNER JOIN genre
  // ON album.genre_id = genre.genre_id
  // WHERE
  // album.album_id = ${rowid};`

//  let getalbum = `SELECT album.album_title, album.artist, album.album_desc, album.year_of_release, song.title, genre.name
//   FROM album
//   INNER JOIN genre
//   ON album.genre_id = genre.genre_id
//   INNER JOIN album_tracklist
//   ON album.album_id = album_tracklist.album_id
//  INNER JOIN song
//   ON album_tracklist.song_id = song.song_id
//   WHERE
//   album.album_id = ${rowid};`

  let getalbum = `SELECT album.album_title, album.artist, album.album_desc, album.year_of_release, genre.name, GROUP_CONCAT(song.title SEPARATOR ' ') AS songtitle
  FROM album
  INNER JOIN genre
  ON album.genre_id = genre.genre_id
  INNER JOIN album_tracklist
  ON album.album_id = album_tracklist.album_id
  INNER JOIN song
  ON album_tracklist.song_id = song.song_id
  WHERE album.album_id = ${rowid}
  GROUP BY album.album_id;`

    
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


app.get("/register", (req, res) => {
  res.render("register");
});

app.post('/admin/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let usertype = req.body.status;


  
  let albumsql = "INSERT INTO auth_user (username, password, first_name, last_name, status) VALUES( ? , ? , ? , ? , ?)";
  db.query(albumsql,[username, password, firstname, lastname, usertype],(err, rows)=>{
    if(err) throw err;
    res.redirect('/');
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







app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000");
});




